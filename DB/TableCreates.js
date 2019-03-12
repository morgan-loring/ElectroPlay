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
        '"Format"   TEXT,',
        '"Rating"   INTEGER DEFAULT 0);'].join('\n')
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
        '"TimeStamp"    TEXT NOT NULL DEFAULT current_timestamp, ',
        '"Theme"        TEXT NOT NULL, ',
        '"Queue"	TEXT,',
        '"Volume"	INT NOT NULL, ',
        '"Muted"	INT NOT NULL, ',
        '"Repeat"	INT NOT NULL, ',
        '"Shuffle"	INT NOT NULL, ',
        '"PlaybackSpeed"	INT NOT NULL ',
        ');'].join('\n')
    );

    db.close((err) => {
        if (err) console.log(err);
    });
}

module.exports = {
    Init: init_func
}