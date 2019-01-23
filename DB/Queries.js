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
    let result = knex.select('*')
        .from('Playlists')
        .join('PlaylistNames', 'Playlists.NameID', 'PlaylistNames.ID')
        .orderBy('NameID');
    result.then(function (rows) {
        callback(rows);
    })
}