/*const express = require('express');*/
const { Pool } = require('pg');
/*const cors = require('cors');
const bodyParser = require('body-parser');*/

/*const app = express();
const port = process.env.PORT || 3001;*/

const pool = new Pool({
    user: "vadev",
    password: "12345",
    host: "localhost",
    port: "9123", //L9123
    database: "epos"
});

/*app.use(express.json());
app.use(cors());
app.use(bodyParser.json());*/


/*app.post("/select_components", async (req, res) => {
    const { query } = `SELECT c.id, c.name as "Название", c.description as "Описание"
                    FROM components.{} c`;
    pool.query(query).then((response) => {
        console.log("--TEST--");
        console.log(response);
    })
}).catch((e) => {
    console.log(e);
});*/

/*app.post('/execute-query', async (req, res) => {
    const { query } = req.body;

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});*/

/*app.get("/adduser", (req, res) => {
    console.log(req.body);
    res.send("Responce received: " + req.body);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});*/

//module.exports = pool;

async function testReq(userData) {

  const query = `SELECT c.id, c.name as "Название", c.description as "Описание"
                    FROM components.components c`;

  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

module.exports = pool;
module.exports = {
  testReq,
};
