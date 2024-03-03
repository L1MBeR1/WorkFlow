/*const express = require("express");
const cors = require("cors");
const pool = require("./database");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/adduser", (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

app.listen(4000, () => console.log("on L4000"));*/

const express = require("express");
const cors = require("cors");
const pool = require("./database");
const { testReq } = require("./database"); 

const app = express();

app.use(express.json());
app.use(cors());

app.post("/test", async (req, res) => {
  try {
    const userData = req.body;
    const addedUser = await testReq(userData);
    console.log(":", addedUser);
    res.json(addedUser);
  } catch (error) {
    console.error("Error adding user to the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4000, () => console.log("on L4000"));
