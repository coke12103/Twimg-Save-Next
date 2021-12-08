const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    // EventListener(main => renderer)
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

    onQueueUpdate: (listener) => {
      ipcRenderer.on('ipc-queue-update', (event, arg) => listener(arg));
    },

    onClipboardChange: (listener) => {
      ipcRenderer.on('ipc-clipboard-change', (event, arg) => listener(arg));
    },

    // EventListener(renderer => main)
    emitClipboardCheckChange: (value) => {
      ipcRenderer.send('ipc-clipboard-check-change', value);
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
