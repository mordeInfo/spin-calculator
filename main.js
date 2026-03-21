const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 680,
    height: 600,
    minHeight: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#0d1b2a'
  })

  win.loadFile('index.html')

  win.webContents.on('did-finish-load', () => {
    autoUpdater.checkForUpdates()
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('quit-and-install', () => { autoUpdater.quitAndInstall() })
ipcMain.on('close-window', () => { win.close() })
ipcMain.on('minimize-window', () => { win.minimize() })

autoUpdater.on('update-available', () => {
  win.setSize(680, 640)
  win.webContents.send('update-available')
})

autoUpdater.on('download-progress', (progress) => {
  win.webContents.send('download-progress', Math.round(progress.percent))
})

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update-downloaded')
})

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'mordeInfo',
  repo: 'spin-calculator',
  private: true,
  token: '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'
})
