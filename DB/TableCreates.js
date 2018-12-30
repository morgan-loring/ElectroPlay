const sqlite3 = require('sqlite3').verbose();

function init_func() {
    let db = new sqlite3.Database('./DB/Library.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) console.log(err);
    });

    db.run(['CREATE TABLE IF NOT EXISTS "Songs" (',
        '"ID"	INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,',
        '"Path"	TEXT NOT NULL,',
        '"Title"	TEXT NOT NULL );'].join('\n')
    )

    db.run(['CREATE TABLE IF NOT EXISTS "Settings" (',
        '"Setting1"	TEXT NOT NULL,',
        '"Setting2"	TEXT NOT NULL );'].join('\n')
    )

    db.close((err) => {
        if (err) console.log(err);
    })
}

module.exports = {
    Init: init_func
}