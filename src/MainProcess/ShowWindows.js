const { BrowserWindow } = require('electron');
const url = require('url');

exports.ShowAddFileWindow = function () {
    let win = new BrowserWindow({
        width: 500,
        height: 300
    });

    win.loadURL(url.format({
        pathname: '../../public/AddFile.html',
        protocal: "file",
        slashes: true
    }));

    win.webContents.openDevTools({ mode: "detach" });

    win.once('ready-to-show', () => { win.show(); })

    win.on('closed', function () {
        win = null;
    });
}