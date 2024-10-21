const { contextBridge, ipcRenderer } = require("electron");

// IPC 통신을 통해 메모 데이터를 불러오고 저장하는 기능을 노출
contextBridge.exposeInMainWorld("fileSystem", {
  loadMemos: () => ipcRenderer.invoke("load-memos"),
  saveData: (filePath, memoData) =>
    ipcRenderer.invoke("save-data", { filePath, memoData }),
});
