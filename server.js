const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./subscriptions.db', connected);

function connected(err){
    if (err){
        console.log(err.message);
        return; 
    }
    console.log('Connected to SQLite database')
}

let sql = `CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clientName TEXT NOT NULL,
  subName TEXT NOT NULL,
  expiration DATE,
  price REAL
)`;

db.run(sql, (err)=>{
    if(err){
       console.error('Error creating subscriptions table:', err.message); 
    } else{
       console.log('CREATED TABLE')
    }
    
});

app.get('/api/subscriptions', (req, res) => {
  db.all('SELECT * FROM subscriptions', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/subscriptions', (req, res) => {
  const { clientName, subName, expiration, price } = req.body;
  db.run('INSERT INTO subscriptions (clientName, subName, expiration, price) VALUES (?, ?, ?, ?)',
    [clientName, subName, expiration, price],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

app.delete('/api/subscriptions/:id', (req, res) => {
  db.run('DELETE FROM subscriptions WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
