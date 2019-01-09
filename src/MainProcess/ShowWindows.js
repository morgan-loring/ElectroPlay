const { BrowserWindow } = require('electron');
const url = require('url');

exports.ShowAddFileWindow = function (parentWin) {
    let win = new BrowserWindow({
        width: 500,
        height: 300,
        parent: parentWin
    });

    win.loadURL(url.format({
        pathname: '../../public/AddFile.html',
        protocal: "file",
        slashes: true
    }));

    win.webContents.openDevTools({ mode: "detach" });

    win.once('ready-to-show', () => { win.show(); })
}

exports.ShowAddWebFileWindow = function (parentWin) {
    let win = new BrowserWindow({
        width: 500,
        height: 300,
        parent: parentWin
    });

    win.loadURL(url.format({
        pathname: '../../public/AddWebFile.html',
        protocal: "file",
        slashes: true
    }));

    win.webContents.openDevTools({ mode: "detach" });

    win.once('ready-to-show', () => { win.show(); })
}