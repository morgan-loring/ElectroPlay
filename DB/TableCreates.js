const sqlite3 = require('sqlite3').verbose();

function init_func() {
    let db = new sqlite3.Database('./DB/Library.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) console.log(err);
    });

    db.run(['CREATE TABLE IF NOT EXISTS "Songs" (',
        '"ID"	    INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,',
        '"Path"	    TEXT NOT NULL,',
        '"Title"	TEXT NOT NULL,',
        '"Album"    TEXT,',
        '"Artist"   TEXT,',
        '"Format"   TEXT);'].join('\n')
    );

    db.run(['CREATE TABLE IF NOT EXISTS "PlaylistNames" (',
        '"ID"       INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,',
        '"Name"     TEXT);'].join('\n')
    );

    db.run(['CREATE TABLE IF NOT EXISTS "Playlists" (',
        '"NameID"       INTEGER,',
        '"Order"        INTEGER,',
        '"SongID"       INTEGER,',
        'FOREIGN KEY(SongID) REFERENCES Songs(ID)',
        'FOREIGN KEY(NameID) REFERENCES PlaylistNames(ID)',
        'ON DELETE CASCADE',
        ');'].join('\n')
    );

    db.run(['CREATE TABLE IF NOT EXISTS "FolderNames" (',
        '"ID"       INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,',
        '"Name"     TEXT);'].join('\n')
    );

    db.run(['CREATE TABLE IF NOT EXISTS "Folders" (',
        '"NameID"       INTEGER,',
        '"Order"        INTEGER,',
        '"SongID"       INTEGER,',
        'FOREIGN KEY(SongID) REFERENCES Songs(ID)',
        'FOREIGN KEY(NameID) REFERENCES FolderNames(ID)',
        'ON DELETE CASCADE',
        ');'].join('\n')
    );

    db.run(['CREATE TABLE IF NOT EXISTS "Settings" (',
        '"Setting1"	TEXT NOT NULL,',
        '"Setting2"	TEXT NOT NULL );'].join('\n')
    );

    db.close((err) => {
        if (err) console.log(err);
    });
}

module.exports = {
    Init: init_func
}