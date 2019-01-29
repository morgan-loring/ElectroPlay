const DB_Queries = require('./Queries');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.RemoveFileFromPlaylist = function (data, callback) {
    let result = knex
        .del()
        .from('Playlists')
        .where('SongID', data.SongID).andWhere('NameID', data.NameID);
    result.then((e) => {
        DB_Queries.GetPlaylists(callback);
    });
};

exports.DeletePlaylist = function (id, callback) {
    knex.del()
        .from('PlaylistNames')
        .where('ID', id)
        .then((e) => {
            DB_Queries.GetPlaylists(callback);
        });
};