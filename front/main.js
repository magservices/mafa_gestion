require('electron-reload')(__dirname);

const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    fullscreen: true,  // Toujours en plein écran
    resizable: false,  // Désactiver le redimensionnement de la fenêtre
    frame: false,  // Supprime la barre de titre par défaut
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Charge le preload.js
      nodeIntegration: false, // Désactive nodeIntegration pour plus de sécurité
      contextIsolation: true  // Maintient l'isolation de contexte pour la sécurité
    }
  });

  // Charger le fichier index.html
  win.loadFile(path.join(__dirname, 'dist/mafa-gestion/browser/index.html'));

  // Listen for minimize and close events
  ipcMain.on('window-minimize', () => {
    win.minimize();  // Utiliser 'win' au lieu de 'mainWindow'
  });

  ipcMain.on('window-close', () => {
    win.close();  // Utiliser 'win' au lieu de 'mainWindow'
  });

  // Gérer le cas où le chargement échoue
  win.webContents.on('did-fail-load', () => {
    win.loadFile(path.join(__dirname, 'dist/mafa-gestion/browser/index.html'));
  });

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
