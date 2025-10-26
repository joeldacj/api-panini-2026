import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./panini.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos panini.db.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Confederation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )`, (err) => {
    if (err) console.error("Error creando tabla Confederation:", err.message);
  });

  db.run(`CREATE TABLE IF NOT EXISTS Selection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT UNIQUE,
    shieldUrl TEXT,
    championsCount INTEGER DEFAULT 0,
    confederationId INTEGER,
    FOREIGN KEY (confederationId) REFERENCES Confederation (id)
  )`, (err) => {
    if (err) console.error("Error creando tabla Selection:", err.message);
  });

  db.run(`CREATE TABLE IF NOT EXISTS Player (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    clubTeam TEXT,
    imageUrl TEXT,
    dribling INTEGER,
    velocidad INTEGER,
    regate INTEGER,
    selectionId INTEGER,
    FOREIGN KEY (selectionId) REFERENCES Selection (id)
  )`, (err) => {
    if (err) console.error("Error creando tabla Player:", err.message);
  });
});

export default db;