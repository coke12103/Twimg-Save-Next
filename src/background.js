'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path';
import fs from 'fs';

const isDevelopment = process.env.NODE_ENV !== 'production'

const ClayCore = require('./main/clay/core.js');
const QueueManager = require('./main/queue/index.js');

const SettingsManager = require('./main/settings/index.js');
const CategoryManager = require('./main/category/index.js');

let win;

const clay_core = new ClayCore();
const queues = new QueueManager();

const settings = new SettingsManager();
const categorys = new CategoryManager();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  let bounds = {};
  let bounds_file;

  const bounds_template = [
    { id: 'width', default_value: 800 },
    { id: 'height', default_value: 600 },
    { id: 'x', default_value: 0 },
    { id: 'y', default_value: 0 }
  ];

  try{
    bounds_file = JSON.parse(fs.readFileSync('./bounds.json', 'utf-8'));
  }catch(e){
    bounds_file = {};
    console.log(e);
  }

  for(var val of bounds_template) bounds[val.id] = val.id in bounds_file ? bounds_file[val.id] : val.default_value;

  // Create the browser window.
  win = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
      worldSafeExecuteJavaScript: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.on('close', function(){
    fs.writeFileSync('./bounds.json', JSON.stringify(win.getBounds(), null, ' '));
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

function init_core(){
  // 起動順序
  // 0. ClayCoreのinit(定義時に完了)
  // 1. 設定の読み込み
  // 2. カテゴリのロード
  // 3. 各種イベンドの登録
  // 4. レンダラー側のロード完了をトリガーにプラグインの読み込み(プラグインデバッグ用にレンダラー側にログを吐かせるため)
  // 5. キューのinit
  try{
    settings.init();
    categorys.init(settings.get('categorys_path'));
  }catch(err){
    console.log(err);
    process.exit(1);
  }

  // event init
  clay_core.on('status_text_update', (arg) => { win.webContents.send('ipc-status-text-change', arg) });
  clay_core.on('target_sns_update', (arg) => { win.webContents.send('ipc-target-sns-change', arg) });
  clay_core.on('console_log_update', (arg) => { win.webContents.send('ipc-console-log', arg) });

  categorys.on('update', () => { win.webContents.send('ipc-update-categorys', categorys.all()) });

  queues.on('update', (arg) => { clay_core.logger.log(arg) });
  queues.on('done', (arg) => { clay_core.logger.log(arg, queues.list_queue()) });

  ipcMain.on('ipc-download', (event, data) => {
    clay_core.logger.log(`url: ${data.url}`);
    clay_core.logger.log(`category: ${data.category}`)
  });

  ipcMain.on('ipc-request-categorys', () => {
    win.webContents.send('ipc-update-categorys', categorys.all());
  });

  win.webContents.once('did-finish-load', ()=>{
    // clay plugin init
    clay_core.reset();

    clay_core.load_plugins_folder('./plugins');

    // queue init
    queues.init(clay_core);

    // test
    setTimeout(function(){
      try{
        clay_core.logger.log(queues.list_queue());
        queues.add('https://twitter.com/coke12103/status/1391116694198890496', './test/');
        queues.add('https://twitter.com/coke12103/status/1410013235730812931', './test/');
        queues.add('https://twitter.com/coke12103/status/1406347848128503808', './test/');
        queues.add('https://twitter.com/coke12103/status/1398438979184193539', './test/');
        clay_core.logger.log(queues.list_queue());
        // clay_core.exec_plugin('https://twitter.com/coke12103/status/1391116694198890496', './test/');

        // clay_core.logger.log(settings.get('categorys_path'));

        // var cat = categorys.all();

        // clay_core.logger.log(cat);

        // clay_core.logger.log(categorys.get(cat[0].id));

        // clay_core.logger.log(categorys.add('test', './'));

        // clay_core.logger.log(categorys.all());

        // clay_core.logger.log(categorys.edit(cat[0].id, 'edit_test', cat[0].save_dir));

        // clay_core.logger.log(categorys.all());

        // clay_core.logger.log(categorys.del('remove_this'));

        // clay_core.logger.log(categorys.all());
        // clay_core.logger.log(clay_core.list_plugins());
      }catch(err){
        clay_core.logger.log(err);
      }

    }, 1000);
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  init_core();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
