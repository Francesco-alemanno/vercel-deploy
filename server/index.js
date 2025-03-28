import express, { json } from "express";
import { db } from "./initDb.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 5001;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

app.use(json());
app.use(cors());

// 🛡️ Middleware per verificare il token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Accesso negato, token mancante" });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token non valido" });
    }
    req.user = user; // Salviamo i dati dell'utente nel `req`
    next();
  });
};

// 🔹 Rotta base
app.get("/", (req, res) => {
  res.send("server is running");
});

// 📌 Ottenere tutti gli utenti (PROTETTO con JWT)
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await db.manyOrNone(`SELECT id, nome, cognome, email FROM users`);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Errore nel server" });
  }
});

// 📌 Registrazione utente
app.post("/registrazione", async (req, res) => {
  const { nome, cognome, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db.none(
      "INSERT INTO users (nome, cognome, email, password) VALUES($1,$2,$3,$4)",
      [nome, cognome, email, hashedPassword]
    );

    res.status(201).json({ message: "Registrazione completata con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.oneOrNone(
      `SELECT id, nome, cognome, email, password FROM users WHERE email=$1`,
      [email]
    );

    if (!user) {
      return res.status(400).json({ message: "Credenziali errate" });
    }

    const matching = await bcrypt.compare(password, user.password);
    if (!matching) {
      return res.status(400).json({ message: "Credenziali errate" });
    }

    
    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      JWT_SECRET,
      { expiresIn: "10h" } 
    );

    res.status(200).json({
      message: "Login effettuato con successo",
      token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await db.oneOrNone(
      `SELECT id, nome, cognome, email FROM users WHERE id=$1`,
      [req.user.id]
    );
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore nel server" });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
