const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.InsertNewFile = function (FileData) {
    knex('Songs').insert(FileData)
        .then((r) => {
        });
}