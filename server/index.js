import express, { json } from 'express'


const app = express();
const port = 5001;

app.use(json())


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

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
