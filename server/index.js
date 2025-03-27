import express, { json } from "express";

import { getAllUsers, login, registrazione } from "./controllers.js";
const app = express();
const port = 5001;

app.use(json());

app.get("/", (req, res) => {
  res.send("server is runnin");
});

app.get("/users", getAllUsers);
app.post('/registrazione', registrazione);
app.post('/login', login);


app.listen(port, () => {
  console.log(`server started on ${port}`);
});
