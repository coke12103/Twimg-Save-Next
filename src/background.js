'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production'

const ClayCore = require('./main/clay/core.js');
const SettingsManager = require('./main/settings/index.js');
const CategoryManager = require('./main/category/index.js');

let win;

const clay_core = new ClayCore();
const settings = new SettingsManager();
const categorys = new CategoryManager();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
      worldSafeExecuteJavaScript: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

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
  try{
    settings.init();
    categorys.init(settings.get('categorys_path'));
  }catch(err){
    console.log(err);
    process.exit(1);
  }

  setTimeout(function(){
  // event init
  clay_core.on('status_text_update', (arg) => { win.webContents.send('ipc-status-text-change', arg) });
  clay_core.on('target_sns_update', (arg) => { win.webContents.send('ipc-target-sns-change', arg) });
  clay_core.on('console_log_update', (arg) => { win.webContents.send('ipc-console-log', arg) });

  // clay plugin init
  clay_core.load_plugins_folder('./plugins');

  }, 1000);

  // test
  setTimeout(function(){
    try{
      clay_core.exec_plugin('https://twitter.com/coke12103/status/1391116694198890496', './test/');

      clay_core.logger.log(settings.get('categorys_path'));

      var cat = categorys.all();

      clay_core.logger.log(cat);

      clay_core.logger.log(categorys.get(cat[0].id));

      clay_core.logger.log(categorys.add('test', './'));

      clay_core.logger.log(categorys.all());

      clay_core.logger.log(categorys.edit(cat[0].id, 'edit_test', cat[0].save_dir));

      clay_core.logger.log(categorys.all());

    }catch(err){
      clay_core.logger.log(err);
    }

  }, 2000);

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
