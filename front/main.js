require('electron-reload')(__dirname);


const {app, BrowserWindow} = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    fullscreen: true,  // Toujours en plein écran
    resizable: false,  // Désactiver le redimensionnement de la fenêtre
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,  // Permet d'utiliser Electron avec Angular
    }
  });

  // Charger l'application Angular en mode développement
  win.loadURL(`http://localhost:4200//dash/student`);

  // Gérer l'événement de fermeture
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

// Quitter l'application si toutes les fenêtres sont fermées, sauf sur macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recréer une fenêtre si l'application est activée (sur macOS par exemple)
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
