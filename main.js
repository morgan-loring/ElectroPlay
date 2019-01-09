const { app, BrowserWindow, Menu } = require('electron');
const url = require("url");
const path = require("path");
const DB_Init = require('./DB/TableCreates');
const DB_Inserts = require('./DB/TableInserts');
const DB_Queries = require('./DB/Queries');
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
    ignored: /node_modules|Library.db|[\/\\]\./
});

let mainWindow = null;

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add File to Library',
                click() { AppWindows.ShowAddFileWindow(mainWindow); }
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


// app.on('active', () => {
//     if (mainWindow === null) {
//         createWindow();
//     }
// })

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    createWindow();

    ipc.on('GetLibrary', function (event) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecieveLibrary', rows);
        };
        DB_Queries.GetLibrary(callback);
    });

    ipc.on('AddFile', function (event, arg) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecieveLibrary', rows);
        };
        DB_Inserts.InsertNewFile(arg, callback);
    });
});


DB_Init.Init();
