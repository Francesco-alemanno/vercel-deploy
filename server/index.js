const express= require('express')
const app = express();
const port = 5001;
app.use("/", (req, res) => {
  res.send("server is runnin");
});

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
