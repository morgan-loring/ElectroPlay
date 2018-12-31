const { app, BrowserWindow, Menu } = require('electron');
const url = require("url");
const path = require("path");
const DB_Init = require('./DB/TableCreates');
const DB_Inserts = require('./DB/TableInserts');
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

let mainWindow = null;

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
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "/public/index.html"),
        protocal: "file",
        slashes: true
    }));

    mainWindow.webContents.openDevTools({ mode: "detach" });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}


app.on('active', () => {
    if (mainWindow === null) {
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


    ipc.on('GetLibrary', function (event) {
        let result = knex.select('*').from('Songs').orderBy('ID', 'asc');
        result.then(function (rows) {
            mainWindow.webContents.send('RecieveLibrary', rows);
        })
    });

    ipc.on('AddFile', function (event, arg) {
        DB_Inserts.InsertNewFile(arg);
    });
});


DB_Init.Init();
