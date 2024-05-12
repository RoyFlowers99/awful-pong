const { app, BrowserWindow, globalShortcut } = require('electron');

// Creates the main window
function createWindow() {
  const win = new BrowserWindow({
    width: 1920,              
    height: 1080,             
    icon: `icons/icon.icns`,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Loads HTML file into the window
  win.loadFile('index.html');

  globalShortcut.register('Escape', () => {
    win.close();
  });
}
app.on('will-quit', () => {
  // Unregister all shortcuts when the application is quitting
  globalShortcut.unregisterAll();
});
// Calls createWindow() when the app is ready
app.whenReady().then(createWindow);

// Quits the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Opens a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

