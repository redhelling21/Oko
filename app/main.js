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
        frame: true
    });

    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', onClosed);

    return win;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (child !== undefined) {
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

var scanFolders = async function(dir, event) {
    var pathList = [];
    pathList = walkSync(dir, pathList);
    event.sender.send('scan-folders-reply', pathList);
}

ipcMain.on('scan-folders', (event, arg) => {
    scanFolders(arg, event);
})

var walkSync = function(dir, filelist) {
        try {
            var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
            filelist = filelist || [];
            files.forEach(function(file) {
                if (fs.statSync(dir + '/' + file).isDirectory()) {
                    filelist = walkSync(dir + '/' + file, filelist);
                }
                else {
                    if(['png', 'jpg', 'jpeg'].indexOf(file.split('.').pop()) !== -1){
                        filelist.push(dir + '/' + file);
                    }
                }
            });
        }catch(err) {
            console.log(err.message);
        }finally {
            return filelist;
        }
    };
