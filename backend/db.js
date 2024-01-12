const mysql = require('mysql');


const db = mysql.createConnection({
    //development
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'CampusQuestDB'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

module.exports = db;