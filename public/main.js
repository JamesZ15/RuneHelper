const { app, BrowserWindow, ipcMain, globalShortcut, screen } = require('electron');
const { path: pathTo } = require('ghost-cursor');
const path = require("path");
const fs = require("fs");
const { mouse, left, right, up, down, straightTo, screen: nutScreen } = require("@nut-tree/nut-js");

const WindMouse = require("windmouse");

// Initialize WindMouse class
const windMouse = new WindMouse(Math.floor(Math.random() * 10));

// MouseSettings
let mouseSettings = {
  startX: Math.ceil(Math.random() * 1920),
  startY: Math.ceil(Math.random() * 1080),
  endX: Math.ceil(Math.random() * 1920),
  endY: Math.ceil(Math.random() * 1080),
  gravity: Math.ceil(Math.random() * 10),
  wind: Math.ceil(Math.random() * 10),
  minWait: 2,
  maxWait: Math.ceil(Math.random() * 5),
  maxStep: Math.ceil(Math.random() * 3),
  targetArea: Math.ceil(Math.random() * 10),
};
// Print points
// async function logPoints() {
//   let points = await windMouse.GeneratePoints(mouseSettings);
//   for (let i = 0; i < points.length; i++) {
//     console.log(points[i]);
//   }  
// }
// logPoints();


// nut js
// (async () => {
//     await mouse.move(left(500));
//     await mouse.move(up(500));
//     await mouse.move(right(500));
//     await mouse.move(down(500))
// })();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
function createWindow () {
  // Create the browser window.
  // win = new BrowserWindow({
  //   title:"TaskMaster",
  //   frame:false, // Whether to include toolbar
  //   width:305,
  //   height:305,
  //   maxHeight:400,
  //   maxWidth:400,
  //   minHeight:250,
  //   minWidth:250,
  //   //backgroundColor:'#7B435B',
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //     enableRemoteModule: false,
  //     preload: path.join(__dirname, "preload.js"),
  //   },
  //   transparent: true,
  // })

  // For Debugging
  win = new BrowserWindow({
    title:"TaskMaster",
    frame:false, // Whether to include toolbar
    width:800,
    height:800,
    maxHeight:1080,
    maxWidth:1920,
    minHeight:250,
    minWidth:250,
    //backgroundColor:'#7B435B',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    transparent: true,
  })

  //load the index.html from a url
  win.loadURL('http://localhost:3000');

  // Open the DevTools.
  // This will disable transparency
  win.webContents.openDevTools();

  // Make window click throughable (also have frame false and transparent true)
  win.setIgnoreMouseEvents(true, {forward: true})
  win.setAlwaysOnTop(true);

//   const windowOne = new BrowserWindow()
//     // load HTML file via url
//     windowOne.loadURL('https://www.electronjs.org/')
//     const windowTwo = new BrowserWindow()
//     // load HTML file locally
//     windowTwo.loadFile('index.html')

// Children windows are supported
// They're always above parent windows
// let heyparent = new BrowserWindow()
//  let heychild = new BrowserWindow({ parent: heyparent })
//  heychild.show()
//  heyparent.show()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  let clickThrough = true;
  let miningPoints = [];

  // setInterval(async () => {
  //   let nutPos = await mouse.getPosition();
  //   console.log(nutPos);
  // }, 40);

  globalShortcut.register('CommandOrControl+T', () => {
    console.log('CommandOrControl+T is pressed, toggling click through')  
    clickThrough = !clickThrough;  
    win.setIgnoreMouseEvents(clickThrough, {forward: clickThrough})
    win.setAlwaysOnTop(clickThrough);
    win.frame = clickThrough;
    win.webContents.send("fromMain", "HOTKEY,'CommandOrControl+T'");
  }) 
  
  globalShortcut.register('CommandOrControl+I', async () => {
    console.log('CommandOrControl+I');     
    mouse.config.mouseSpeed = 5000;
    let nutPos = await mouse.getPosition();
    mouseSettings.startX = nutPos.x;
    mouseSettings.startY = nutPos.y;
    mouseSettings.endX = miningPoints[0].x;
    mouseSettings.endY = miningPoints[0].y;
    let points = await windMouse.GeneratePoints(mouseSettings);
    points = points.map((entryArray) => { return { x: entryArray[0], y: entryArray[1]}});
    //const route = pathTo(nutPos, miningPoints[0]);    

    // Increment mouse speed by % each callback
    mouse.move(points, (x) => {
      let currSpeed = mouse.config.mouseSpeed;
      let randInt = Math.floor(Math.random() * 10);
      if (randInt > 4) {
        mouse.config.mouseSpeed = Math.floor(currSpeed * 1.01);
      } else {
        mouse.config.mouseSpeed = Math.floor(currSpeed * 0.98);
      }             
      return x;    
      });
    win.webContents.send("fromMain", "HOTKEY,'CommandOrControl+I'");
  });

  globalShortcut.register('CommandOrControl+U', async () => {
    let nutPos = await mouse.getPosition();
    let color = await nutScreen.colorAt(nutPos);
    console.log(color);
  })

  globalShortcut.register('CommandOrControl+M', async () => {
    console.log('CommandOrControl+M is pressed');
    console.log('Setting mining point');
    let mousePos = screen.getCursorScreenPoint();
    let nutPos = await mouse.getPosition();
    if (miningPoints.length < 3) {
      miningPoints.push(nutPos);
    } else {
      miningPoints.shift();
      miningPoints.push(nutPos);
    }    
    console.log(mousePos);
    win.webContents.send("fromMain", `HOTKEY,CommandOrControl+X+Y,${JSON.stringify(miningPoints)}`);
  })
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {

    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Use IPC for security reasons
// Update validChannels in preload.js to be allowed
ipcMain.on("toMain", async (event, args) => {
  // win.webContents.send("fromMain", JSON.stringify({ msg: "This is from the toMain handler"}, undefined, 2));
  console.log(event, args);
  win.webContents.send("fromMain", "toMain response");
  // fs.readFile("path/to/file", (error, data) => {
  //   // Do something with file contents

  //   // Send result back to renderer process
  //   win.webContents.send("fromMain", responseObj);
  // });
});
