const {
  ipcRenderer,
  contextBridge,
} = require("electron");

contextBridge.exposeInMainWorld("dataApi", {
  reqWriteData: function(data) {
    ipcRenderer.send("req-write-data", [data]);
  },
  reqReadData: function() {
    ipcRenderer.send("req-read-data", []);
  },
  receiveWriteData: function(func) {
    ipcRenderer.once("receive-write-data", (event, ...args) => func(event, ...args))
  },
  receiveReadData: function(func) {
    ipcRenderer.once("receive-read-data", (event, ...args) => func(event, ...args))
  },
});