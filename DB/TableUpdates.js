const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/Library.db'
    },
    useNullAsDefault: true
});

exports.UpdateRating = function (arg) {
    knex('Songs')
        .update('Rating', arg.Rating)
        .where('ID', arg.ID)
        .then((e) => { });
}