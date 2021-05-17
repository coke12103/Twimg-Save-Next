const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    // EventListener
    onStatusTextChange: (listener) => {
      ipcRenderer.on('ipc-status-text-change', (event, arg) => listener(arg));
    }
  }
);
