const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.GetLibrary = function (callback) {
    let result = knex.select('*').from('Songs').orderBy('ID', 'asc');
    result.then(function (rows) {
        callback(rows);
    });
};

let calcPlaylistRows = (PlaylistRows, PlaylistNameRows) => {
    let playlists = [];
    for (let ii = 0; ii < PlaylistNameRows.length; ii++) {
        playlists.push({
            ID: PlaylistNameRows[ii].ID,
            Name: PlaylistNameRows[ii].Name,
            Files: []
        });
    }

    for (let ii = 0; ii < PlaylistRows.length; ii++) {
        for (let jj = 0; jj < playlists.length; jj++) {
            if (playlists[jj].ID == PlaylistRows[ii].NameID) {
                playlists[jj].Files.push(PlaylistRows[ii]);
            }
        }
    }
    return playlists;
};

exports.GetPlaylists = function (callback) {
    let playlists = [];
    let result = knex.select('*')
        .from('Playlists')
        .orderBy('NameID')
        .then((PlaylistRows) => {
            knex.select('*')
                .from('PlaylistNames')
                .orderBy('ID')
                .then((PlaylistNameRows) => {
                    playlists = calcPlaylistRows(PlaylistRows, PlaylistNameRows);
                    callback(playlists);
                });
        });
};

let calcFolderRows = (FolderRows, FolderNameRows) => {
    let folders = [];
    for (let ii = 0; ii < FolderNameRows.length; ii++) {
        folders.push({
            ID: FolderNameRows[ii].ID,
            Name: FolderNameRows[ii].Name,
            Files: []
        });
    }

    for (let ii = 0; ii < FolderRows.length; ii++) {
        for (let jj = 0; jj < folders.length; jj++) {
            if (folders[jj].ID == FolderRows[ii].NameID) {
                folders[jj].Files.push(FolderRows[ii]);
            }
        }
    }
    return folders;
};

exports.GetFolders = function (callback) {
    let folders = [];
    knex.select('*')
        .from('Folders')
        .orderBy('NameID')
        .then((FolderRows) => {
            knex.select('*')
                .from('FolderNames')
                .orderBy('ID')
                .then((FolderNameRows) => {
                    folders = calcFolderRows(FolderRows, FolderNameRows);
                    if (callback != null)
                        callback(folders);
                    else {
                        return folders;
                    }
                });
        });
};
