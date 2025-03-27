import express, { json } from "express";
import { db } from "./initDb.js";

const app = express();
const port = 5001;

app.use(json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("server is runnin");
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.manyOrNone(`SELECT * FROM users`);
    if (!users) {
      res.status(400).json({ message: "utenti non trovati" });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "errore nel server" });
  }
});
app.post("/registrazione", async (req, res) => {
  const { nome, cognome, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const dati = await db.none(
      "INSERT INTO users (nome, cognome, email, password) VALUES($1,$2,$3,$4)",
      [nome, cognome, email, hashedPassword]
    );

    res.status(200).json({ message: "registrazione andata a buon fine" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.oneOrNone(
      `SELECT id, email, password FROM users WHERE email=$1`,
      [email]
    );
    if (!user) {
      return res.status(400).json({ message: "Credenziali errate" });
    }
    const matching = await bcrypt.compare(password, user.password);
    if (!matching) {
      return res.status(400).json({ message: "Credenziali errate" });
    }

    res
      .status(200)
      .json({ message: "login effettuato con successo", userId: user.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
