const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    // EventListener
    onStatusTextChange: (listener) => {
      ipcRenderer.on('ipc-status-text-change', (event, arg) => listener(arg));
    },

    onConsoleLog: (listener) => {
      ipcRenderer.on('ipc-console-log', (event, arg) => listener(arg));
    }
  }
);
