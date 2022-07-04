import express from "express";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
//import { json } from "express/lib/response"; //not sure where this coam from --> delete
import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "123",
    database: "smart-brain",
  },
});

// db.select("*")
//   .from("users")
//   .then((data) => {
//     console.log(data);
//   });
/*
//alternative without knex *******
import pg from "pg";
const conString = "postgres://postgres:123@localhost:5432/smart-brain";

const client = new pg.Client(conString);

(async function () {
  await client.connect();
  await client.query("SELECT * FROM users", (err, res) => {
    if (!err) {
      res.rows.forEach(row => {
        console.log(row);
      });
    } else {
      console.log("Query failed! - " + err.message);
    }
    console.log("success!");
    client.end();
  });
})();
*/
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = 3000;

//ROUTES

app.get("/", (req, res) => {
  res.send("success!");
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => {
    res.status(400).json("unable to register");
  });
});

//not currently used in App
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("user not found");
      }
    })
    .catch(err => res.status(404).json("error fetching user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("unable to fetch entries"));
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
