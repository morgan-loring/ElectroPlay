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
}

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
                    callback(playlists);
                });
        });
}