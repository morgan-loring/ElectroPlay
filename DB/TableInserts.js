const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.InsertNewFile = function (FileData) {
    console.log(FileData);
    knex('Songs').insert(FileData)
        .then((r) => {
            console.log(r);
        });
}