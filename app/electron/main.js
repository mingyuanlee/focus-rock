const { 
  app, 
  BrowserWindow,
  ipcMain,
} = require("electron");
const {
  writeData,
  readData
} = require('./listeners')
const path = require("path");
const { standardResultCodes } = require('./constants')

const isDevelopment = process.env.NODE_ENV === "development";

// This method is called when Electron
// has finished initializing
function createWindow () {
  
  // Create a new window
  let window = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      nodeIntegration: false, 
      webPreferences: {
        sandbox: true,
        devtools:true,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "preload.js")
      }
  });

  // Event listeners on the window
  window.webContents.on("did-finish-load", () => {
    window.show();
    window.focus();
  });

  // Load our HTML file
  // window.loadFile("app/dist/index.html");
  if (isDevelopment) {
    window.loadURL("http://localhost:40992");
  } else {
    console.log("prod");
    window.loadFile("app/dist/index.html");
  }
}

// This method is called when Electron
// has finished initializing
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
      }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
      app.quit();
  }
});

ipcMain.on("req-write-data", async (event, args) => {
  const jsondata = args[0]
  try {
    await writeData(jsondata)
    event.sender.send("receive-write-data", standardResultCodes.SUCCESS, '')
  } catch (error) {
    // logger.error("error saving data:", error)
    event.sender.send("receive-write-data", standardResultCodes.ERROR, error)
  }
})

ipcMain.on("req-read-data", async (event, args) => {
  try {
    const data = await readData()
    event.sender.send("receive-read-data", standardResultCodes.SUCCESS, JSON.stringify(data))
  } catch (error) {
    // logger.error("error saving data:", error)
    event.sender.send("receive-read-data", standardResultCodes.ERROR, error)
  }
})