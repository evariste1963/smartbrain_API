import express from "express";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
//import { json } from "express/lib/response"; //not sure where this coam from --> delete
import knex from "knex";

const postgres = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "123",
    database: "smart-brain",
  },
});

postgres
  .select("*")
  .from("users")
  .then(data => {
    console.log(data);
  });
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
const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@email.com",
      password: "spud",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "sally",
      email: "sally@email.com",
      password: "peas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

//ROUTES

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.email === email && user.password === password) {
      found = true;
      database.users.forEach(user => {
        if (user.email === email) {
          found = true;
          res.json(user);
        }
      });
    }
  });
  if (!found) res.status(400).json("error loggin in");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: (+database.users.at(-1).id + 1).toString(),
    name: name,
    email: email,
    password: password, //don't ever send this -- password
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users.at(-1)); // same as database.users[database.users.length-1]
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("profile not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("profile not found");
  }
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
