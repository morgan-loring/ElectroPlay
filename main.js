const { app, BrowserWindow, Menu } = require('electron');
const url = require("url");
const path = require("path");
const DB_Init = require('./DB/TableCreates');
const AppWindows = require('./src/MainProcess/ShowWindows');

const ipc = require('electron').ipcMain;

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

const liveReload = require("electron-reload"); //this enables live reload, so when renderer.js gets rebuild, it will reload itself instead
//of restarting electron.
//tell the liveReload to reload electron, which resides inside our node_modules folder
liveReload(__dirname, {
    electron: path.join(__dirname, "node_modules", "electron"),
    ignored: /node_modules|helper|data|[\/\\]\./
});

let win = null;

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add File to Library',
                click() { AppWindows.ShowAddFileWindow(); }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 600
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "/public/index.html"),
        protocal: "file",
        slashes: true
    }));

    win.webContents.openDevTools({ mode: "detach" });

    win.on('closed', function () {
        win = null;
    });
}


app.on('active', () => {
    if (win === null) {
        createWindow();
    }
})

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
})
app.on('ready', function () {
    createWindow();


    ipc.on('GetSong', function (event, arg) {
        let whereOb;
        if (arg == -1) whereOb = {};
        else whereOb = { SongID: arg };
        let result = knex.select('*').from('Songs').where(whereOb);
        result.then(function (rows) {
            win.webContents.send('RecieveSong', rows);
        })
    })
});


DB_Init.Init();
