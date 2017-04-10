'use strict';
const electron = require('electron');
const {ipcMain} = require('electron')
const app = electron.app;
const remote = electron.remote;
const dialog = electron.dialog
var child;
// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
    // dereference the window
    // for multiple windows store them in an array
    mainWindow = null;
}

function createMainWindow() {
    var win = new electron.BrowserWindow({
        width: 1400,
        height: 1000,
        frame: false
    });

    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', onClosed);

    return win;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if(child !== undefined){
        	child.kill();
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    mainWindow = createMainWindow();
});

exports.selectDirectory = function() {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
}

var scanFolders = function(dir, event){
	var args = [dir];
	child = require('child_process').fork(`app/scripts/folderScanner.js`, args);
	child.on('message', function (message) {
        event.sender.send('scan-folders-reply', message);
	});
}

ipcMain.on('scan-folders', (event, arg) => {
  scanFolders(arg, event);
})