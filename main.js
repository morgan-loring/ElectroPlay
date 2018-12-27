const { app, BrowserWindow } = require('electron');
const url = require("url");
const path = require("path");
const DB_Init = require('./DB/TableCreates');

const liveReload = require("electron-reload"); //this enables live reload, so when renderer.js gets rebuild, it will reload itself instead
											   	   //of restarting electron.
											       //tell the liveReload to reload electron, which resides inside our node_modules folder
	liveReload(__dirname, {
		electron: path.join(__dirname, "node_modules", "electron"),
		ignored: /node_modules|helper|data|[\/\\]\./
	});

let win = null;

function createWindow() {
    win = new BrowserWindow({width: 1000, height: 600});

    win.loadURL(url.format({
        pathname: path.join(__dirname, "/public/index.html"),
        protocal: "file",
        slashes: true
    }));

    win.webContents.openDevTools({mode: "detach"});

    win.on('closed', function() {
        win = null; 
    });
}

app.on('ready', function () {
    createWindow();
});

app.on('active', () => {
    if (win === null) {
        createWindow();
    }
})

app.on('window-all-closed', function () {
    if(process.platform != 'darwin') {
        app.quit();
    }
})


DB_Init.Init();