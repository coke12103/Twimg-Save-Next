const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    // EventListener
    onStatusTextChange: (listener) => {
      ipcRenderer.on('ipc-status-text-change', (event, arg) => listener(arg));
    },

    onTargetSnsChange: (listener) => {
      ipcRenderer.on('ipc-target-sns-change', (event, arg) => listener(arg));
    },

    onConsoleLog: (listener) => {
      ipcRenderer.on('ipc-console-log', (event, arg) => listener(arg));
    },

    onUpdateCategorys: (listener) => {
      ipcRenderer.on('ipc-update-categorys', (event, arg) => listener(arg));
    },

    // methods
    download: (data) => {
      ipcRenderer.send('ipc-download', data);
    },

    requestCategorys: () => {
      ipcRenderer.send('ipc-request-categorys');
    },
  }
);
