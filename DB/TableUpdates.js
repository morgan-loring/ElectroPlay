const DB_Queries = require('./Queries');

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.UpdateRating = function (arg, callback) {
    knex('Songs')
        .update('Rating', arg.Rating)
        .where('ID', arg.ID)
        .then((e) => { DB_Queries.GetLibrary(callback); });
}