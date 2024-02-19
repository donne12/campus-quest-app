//importation des modules
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-config.js');
let fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/user.js');

//initialisation de l'application
const app = express();
const port = process.env.PORT || 3001;

// Middleware pour activer CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser l'accès depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Méthodes HTTP autorisées
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // En-têtes autorisés
    next();
});

corsOptions = { origin: true }
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuration de la base de données MySQL
const db = require('./db.js');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const staticAssetsDirectory = path.join(__dirname, 'uploads');
app.use(express.static(staticAssetsDirectory));

/**
 * @swagger
 * /api/quests/id:
 *   get:
 *     summary: Récupérer les quêtes faites par un utilisateur
 *     description: 
 *     responses:
 *       '200':
 *         description: Succès
 *       '500':
 *         description: Erreur serveur
 */
app.get('/api/getQuests/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT quests.*, users_quests.status, users_quests.created_at FROM quests INNER JOIN users_quests ON quests.id = users_quests.quest_id WHERE users_quests.user_id = ' + id, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des catégories :', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json(results);
        }
    });
});

//valider une quête
/**
 * @swagger
 * /api/validateQuest:
 *   post:
 *     summary: Valider une quête
 *     description: Valider une quête
 *     requestBody:
 *       description: Objet JSON représentant la quête
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quest_id:
 *                 type: integer
 *                 description: L'id de la quête
 *               user_id:
 *                 type: integer
 *                 description: L'id de l'utilisateur
 *             required:
 *               - quest_id
 *               - user_id
 *     responses:
 *       '201':
 *         description: Quête validée
 *       '400':
 *         description: Requête incorrecte, données invalides
 *       '500':
 *         description: Erreur serveur
 */
app.post('/api/questDone', (req, res) => {
    const { quest_id, user_id } = req.body;
    db.query('UPDATE users_quests SET status = "Terminée" WHERE quest_id = ? AND user_id = ?', [quest_id, user_id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la validation de la quête :', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.status(200).json({ message: 'Quête validée' });
    });
});


/**
 * @swagger
 * /api/quests/{code}:
 *   get:
 *     summary: Récupérer les quêtes faites par un utilisateur
 *     description: 
 *     responses:
 *       '200':
 *         description: Succès
 *       '500':
 *         description: Erreur serveur
 */
app.get('/api/quests/:code', authenticateJWT, (req, res) => {
    const code = req.params.code;
    db.query('SELECT * FROM quests WHERE code=?', code, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la quête :', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.json(results);
    }
    );
});

//faire une quête
/**
 * @swagger
 * /api/quests:
 *   post:
 *     summary: Faire une quête
 *     description: Faire une quête
 *     requestBody:
 *       description: Objet JSON représentant la quête
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quest_id:
 *                 type: integer
 *                 description: L'id de la quête
 *               user_id:
 *                 type: integer
 *                 description: L'id de l'utilisateur
 *               status:
 *                 type: string
 *                 description: Le status de la quête
 *             required:
 *               - quest_id
 *               - user_id
 *               - status
 *     responses:
 *       '201':
 *         description: Quête faite
 *       '400':
 *         description: Requête incorrecte, données invalides
 *       '500':
 *         description: Erreur serveur
 */
app.post('/api/quests', (req, res) => {
    const { quest_id, user_id, status } = req.body;
    //check if the quest is already done
    db.query('SELECT * FROM users_quests WHERE quest_id=? AND user_id=?', [quest_id, user_id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la quête :', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        if (results.length > 0) {
            res.status(200).json({ error: 'La quête a déjà été faite ou en cours.' });
            return;
        }
    });

    db.query('INSERT INTO users_quests (quest_id, user_id, status) VALUES (?,?,?)', [quest_id, user_id, status], (err, result) => {
        if (err) {
            console.error('Erreur lors de la création de la quête :', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.status(201).json({ message: 'Quête commencée' });
    });
});

/**
 * @swagger
 * /api/inscription:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     description: Inscrire un nouvel utilisateur avec un nom, un prénom, un email et un mot de passe.
 *     requestBody:
 *       description: Objet JSON représentant le nouvel utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Le nom de l'utilisateur.
 *               prenom:
 *                 type: string
 *                 description: Le prénom de l'utilisateur.
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *               mot_de_passe:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - mot_de_passe
 *     responses:
 *       '201':
 *         description: Inscription réussie.
 *       '400':
 *         description: Requête incorrecte, données d'utilisateur invalides.
 *       '500':
 *         description: Erreur interne du serveur.
 */
app.post('/api/inscription', (req, res) => {
    const { username, email, password } = req.body;
    const mot_de_passe = password;
    // Vérifiez que l'utilisateur n'existe pas déjà
    User.getUserByEmail(email, (err, existingUser) => {
        if (err) {
            return res.status(200).json({ error: 'Erreur interne du serveur. ' + err });
        }

        if (existingUser) {
            return res.status(200).json({ error: 'Cet utilisateur existe déjà.' });
        }

        // Hash du mot de passe
        bcrypt.hash(mot_de_passe, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                return res.status(201).json({ error: 'Erreur interne du serveur. ' + hashErr });
            }

            // Enregistrez le nouvel utilisateur dans la base de données
            const newUser = new User({ username, email, mot_de_passe: hashedPassword });
            db.query('INSERT INTO utilisateurs (username, email, mot_de_passe) VALUES (?,?,?)', [newUser.username, newUser.email, newUser.mot_de_passe], (insertErr, result) => {
                if (insertErr) {
                    return res.status(500).json({ error: 'Erreur interne du serveur. ' + insertErr });
                }
                // Générez un token JWT
                const token = jwt.sign({ userId: result.insertId, username: newUser.username }, 'secretKey', { expiresIn: '10h' });

                return res.status(201).json({ message: 'Inscription réussie.', token: token, userId: result.insertId });
            });
        });
    });
});

// Connexion de l'utilisateur
/**
 * @swagger
 * /api/connexion:
 *   post:
 *     summary: Connecter un utilisateur existant
 *     description: Connecter un utilisateur existant avec un email et un mot de passe.
 *     requestBody:
 *       description: Objet JSON représentant l'utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *               mot_de_passe:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *             required:
 *               - email
 *               - mot_de_passe
 *     responses:
 *       '200':
 *         description: Connexion réussie.
 *       '400':
 *         description: Requête incorrecte, données d'utilisateur invalides.
 *       '401':
 *         description: Nom d'utilisateur ou mot de passe incorrect.
 *       '500':
 *         description: Erreur interne du serveur.
 */
app.post('/api/connexion', (req, res) => {
    const { email, password } = req.body;
    const mot_de_passe = password;
    // Recherchez l'utilisateur dans la base de données
    User.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Vérifiez le mot de passe
        bcrypt.compare(mot_de_passe, user.mot_de_passe, (compareErr, match) => {
            if (compareErr) {
                return res.status(500).json({ error: 'Erreur interne du serveur' });
            }

            if (!match) {
                return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }

            // Générez un token JWT
            const token = jwt.sign({ userId: user.id, username: user.username }, 'secretKey', { expiresIn: '10h' });

            // Retournez le token JWT
            return res.status(200).json({ token: token, userId: user.id});
        });
    });
});

// Middleware d'authentification JWT
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Authentification requise' });
    }

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }
        req.user = user;
        next();
    });
}

module.exports = app;

//lancement du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
