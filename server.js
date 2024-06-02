
const dotenv = require('dotenv');
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes/routes");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routes);
app.listen(5101, () => console.log(`Server running on localhost:5101`));
