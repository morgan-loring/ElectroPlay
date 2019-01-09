const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.GetLibrary = function(callback) {
    let result = knex.select('*').from('Songs').orderBy('ID', 'asc');
        result.then(function (rows) {
            callback(rows);
        });
}