'use strict';
const electron = require('electron');
const {ipcMain} = require('electron')
const app = electron.app;
const remote = electron.remote;
const dialog = electron.dialog;
const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');
const ep = new exiftool.ExiftoolProcess(exiftoolBin);

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
        ep.close();
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    ep.open();
    mainWindow = createMainWindow();
});

exports.selectDirectory = function() {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
}

var scanFolders = async function(dir, event) {
    var pathList = [];
    var imageList = [];
    var i = 0;
    pathList = walkSync(dir, pathList);
    var metadatas = await readMeta(pathList);

    pathList.forEach(function(path){
        console.log(metadatas[i].data[0])
        imageList.push({
            path: path,
            metadata: metadatas[i].data[0]
        });
        i++;
    })
    console.log("Apres readmeta ?");
    event.sender.send('scan-folders-reply', imageList);
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

var readMeta = function(pathList){
    var promises = [];
    pathList.forEach(function(path){
        promises.push(ep.readMetadata(path));
    });
    return Promise.all(promises).catch(function(err) {
                console.log('A promise failed to resolve', err);
                return promises;
            });
}
