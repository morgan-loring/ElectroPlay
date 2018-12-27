const sqlite3 = require('sqlite3').verbose();

function init_func() {
    let db = new sqlite3.Database('./DB/Library.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) console.log(err);
        else console.log('success');
        console.log('inside', db);
    });

    db.run(['CREATE TABLE IF NOT EXISTS "Songs" (',
        '"ID"	INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,',
        '"Path"	TEXT NOT NULL,',
        '"Title"	TEXT NOT NULL );'].join('\n')
    )
}

module.exports = {
    Init: init_func
}