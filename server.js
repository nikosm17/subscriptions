const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'exampleproject12345@gmail.com',
    pass: 'example1234'
  }
});

function sendReminderEmail(sub){
  const mailOptions = {
    from: 'exampleproject12345@gmail.com',
    to: 'nikos.bolanos99@gmail.com',
    subject: `Reminder: ${sub.subName} for ${sub.clientName} expires in 2 days`,
    text: `The subscription of "${sub.subName}" for client "${sub.clientName}" is expiring on ${sub.expiration}.
  
  Annual Cost: ${sub.price}`
};

transporter.sendMail(mailOptions, function(error, info){
  if(error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

cron.schedule('0 8 * * *', () => {
  console.log('[CRON] Checking for subscriptions expiring in 2 days...');

  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);
  const targetDate = twoDaysLater.toISOString().split('T')[0];

  const query = 'SELECT * FROM subscriptions WHERE expiration = ?';
  db.all(query, [targetDate], (err, rows) => {
    if (err) {
      console.error('DB error:', err.message);
      return;
    }

    if (rows.length === 0) {
      console.log('No subscriptions expiring in 2 days.');
      return;
    }

    rows.forEach(sub => sendReminderEmail(sub));
  });
});

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
    if (err){
       return res.status(500).json({ error: err.message });
    }
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


