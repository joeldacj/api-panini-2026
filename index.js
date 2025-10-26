import express from 'express';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API del Álbum Panini 2026 funcionando! 🏆');
});

app.post('/confederations', (req, res) => {
  const { name } = req.body;
  const sql = 'INSERT INTO Confederation (name) VALUES (?)';

  db.run(sql, [name], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name: name });
  });
});

app.get('/confederations', (req, res) => {
  const sql = 'SELECT * FROM Confederation';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/selections', (req, res) => {
  const { country, shieldUrl, championsCount, confederationId } = req.body;
  const sql = 'INSERT INTO Selection (country, shieldUrl, championsCount, confederationId) VALUES (?, ?, ?, ?)';
  const params = [country, shieldUrl, championsCount, confederationId];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

app.get('/selections', (req, res) => {
  const sql = `
    SELECT 
      Selection.id, Selection.country, Selection.shieldUrl, Selection.championsCount,
      Confederation.name as confederationName
    FROM Selection
    JOIN Confederation ON Selection.confederationId = Confederation.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/selections/:id', (req, res) => {
  const { id } = req.params;

  const sqlSelection = `
    SELECT 
      Selection.id, Selection.country, Selection.shieldUrl, Selection.championsCount,
      Confederation.name as confederationName
    FROM Selection
    JOIN Confederation ON Selection.confederationId = Confederation.id
    WHERE Selection.id = ?
  `;

  db.get(sqlSelection, [id], (err, selection) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!selection) {
      return res.status(404).json({ error: 'Selección no encontrada' });
    }

    const sqlPlayers = 'SELECT * FROM Player WHERE selectionId = ?';
    db.all(sqlPlayers, [id], (err, players) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ ...selection, players: players });
    });
  });
});

app.post('/players', (req, res) => {
  const { name, age, clubTeam, imageUrl, dribling, velocidad, regate, selectionId } = req.body;
  const sql = 'INSERT INTO Player (name, age, clubTeam, imageUrl, dribling, velocidad, regate, selectionId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [name, age, clubTeam, imageUrl, dribling, velocidad, regate, selectionId];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

app.get('/players/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      Player.*,
      Selection.country as selectionName
    FROM Player
    JOIN Selection ON Player.selectionId = Selection.id
    WHERE Player.id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Jugador no encontrado' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});