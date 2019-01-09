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