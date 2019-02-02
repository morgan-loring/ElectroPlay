const { app, BrowserWindow, Menu } = require('electron');
const url = require("url");
const path = require("path");
const DB_Init = require('./DB/TableCreates');
const DB_Inserts = require('./DB/TableInserts');
const DB_Deletes = require('./DB/TableDeletes');
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
            },
            {
                label: 'Add Web Media',
                click() { AppWindows.ShowAddWebFileWindow(mainWindow); }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 1000,
        minHeight: 600
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

    ipc.on('GetPlaylists', function (event) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecievePlaylists', rows);
        };
        DB_Queries.GetPlaylists(callback);
    });

    ipc.on('AddFileToPlaylist', function (event, arg) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecievePlaylists', rows);
        };
        DB_Inserts.AddFileToPlaylist(arg, callback);
    });

    ipc.on('RemoveFileFromPlaylist', function (event, arg) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecievePlaylists', rows);
        };
        DB_Deletes.RemoveFileFromPlaylist(arg, callback);
    });

    ipc.on('DeletePlaylist', function (event, arg) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecievePlaylists', rows);
        };
        DB_Deletes.DeletePlaylist(arg, callback);
    });

    ipc.on('AddCollection', function (event, arg) {
        let callback = (rows) => {

            if (arg == 'Playlist')
                mainWindow.webContents.send('RecievePlaylists', rows);
            else
                mainWindow.webContents.send('RecieveFolders', rows);
        };
        DB_Inserts.AddCollection(arg, callback);
    });

    ipc.on('ShowAddCollectionWin', function (event, arg) {
        AppWindows.ShowAddCollectionWindow(mainWindow, arg);
    });

    ipc.on('GetFolders', function (event) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecieveFolders', rows);
        };
        DB_Queries.GetFolders(callback);
    });

    ipc.on('AddFileToFolder', function (event, arg) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecieveFolders', rows);
        };
        DB_Inserts.AddFileToFolder(arg, callback);
    });

    ipc.on('RemoveFileFromFolder', function (event, arg) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecieveFolders', rows);
        };
        DB_Deletes.RemoveFileFromFolder(arg, callback);
    });

    ipc.on('DeleteFolder', function (event, arg) {
        let callback = (rows) => {
            mainWindow.webContents.send('RecieveFolders', rows);
        };
        DB_Deletes.DeleteFolder(arg, callback);
    });
});

DB_Init.Init();
