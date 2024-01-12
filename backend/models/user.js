const db = require('../db.js');

class User {
  constructor({ id, username, email, mot_de_passe }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.mot_de_passe = mot_de_passe;
  }

  static getUserByEmail(email, callback) {
    db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      const user = new User(results[0]);
      callback(null, user);
    });
  }
}

module.exports = User;
