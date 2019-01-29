const DB_Queries = require('./Queries');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.InsertNewFile = function (FileData, callback) {
    knex('Songs').insert(FileData)
        .then((r) => {
            DB_Queries.GetLibrary(callback);
        });
}

exports.AddFileToPlaylist = function (data, callback) {
    knex('Playlists').insert(data)
        .then((r) => {
            DB_Queries.GetPlaylists(callback);
        })
}

exports.AddCollection = function (arg, callback) {
    knex(arg.Type == 'Playlist' ? 'PlaylistNames' : 'FolderNames')
        .insert({ Name: arg.Name })
        .then((r) => {
            DB_Queries.GetPlaylists(callback);
        });
}