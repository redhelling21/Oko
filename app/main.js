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
        frame: true,
        show: false,
        backgroundColor: '#312450'
    });

    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', onClosed);
    win.once('ready-to-show', () => {
     mainWindow.show()
    })
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
    pathList.forEach(function(path){
    })
    var metadatas = await readMeta(pathList);
    console.log("after readmeta");
    pathList.forEach(function(path){
        imageList.push({
            path: path,
            metadata: metadatas[i].data[0]
        });
        i++;
    })
    event.sender.send('scan-folders-reply', imageList);
}

ipcMain.on('scan-folders', (event, arg) => {
    scanFolders(arg, event);
})

var writeDataList = async function(shots, event){
    var promises = await writeMeta(shots);
    event.sender.send('write-datas-reply', promises);
}

ipcMain.on('save-datas', (event, arg) => {
    writeDataList(arg, event);
})

var walkSync = function(dir, filelist) {
        try {
            var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
            filelist = filelist || [];
            files.forEach(function(file) {
                var newfile = file;
                if(/.*[^\w\s\.\\\/\:\-\(\)\&\[\]\;\!\'\~].*/gi.test(file)){
                    newfile = newfile.sansAccent();
                    newfile = newfile.replace(/[^\w\s\.\\\/\:\-\(\)\&\[\]\;\!\'\~]/gi, '');
                    fs.renameSync(dir + '/' + file, dir + '/' + newfile);
                }
                if (fs.statSync(dir + '/' + newfile).isDirectory()) {
                    filelist = walkSync(dir + '/' + newfile, filelist);
                }
                else {
                    if(['png', 'jpg', 'jpeg', 'gif'].indexOf(file.split('.').pop()) !== -1){
                        filelist.push(dir + '/' + newfile);
                    }
                }
            });
        }catch(err) {
            console.log(err.message);
        }finally {
            return filelist;
        }
    };

var promise_count = 0;

var readMeta = function(pathList){
    var promises = [];
    console.log("readmeta");
    pathList.forEach(function(path){
        promises.push(ep.readMetadata(path));
    });
    console.log("almost return readmeta");
    return Promise.all(promises).catch(function(err) {
                console.log('A promise failed to resolve', err);
                return promises;
            });
}

var writeMeta = function(shots){
    var promises = [];
    shots.forEach(function(value){
        promises.push(ep.writeMetadata(value.path, {Subject: value.tags}));
    });
    return Promise.all(promises).catch(function(err) {
                console.log('A promise failed to resolve', err);
                return promises;
            });
}

String.prototype.sansAccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
}
