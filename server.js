import express from "express";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
//import { json } from "express/lib/response"; //not sure where this coam from --> delete
import knex from "knex";
import { handleSignin } from "./controllers/signin.js";
import { handleRegister } from "./controllers/register.js";
import { handleImage, handleApiCall } from "./controllers/image.js";
import { handleProfileGet } from "./controllers/profile.js";

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
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

const port = process.env.PORT || 3000;

//ROUTES

app.get("/", (req, res) => {
  res.send("success!");
});

//app.post("/register", (req, res) => handleSignin(req, res, db, bcrypt)); //method A
app.post("/signin", handleSignin(db, bcrypt)); //alternative method B
app.post("/register", (req, res) => handleRegister(req, res, db, bcrypt));
//not currently used in App
app.get("/profile/:id", (req, res) => handleProfileGet(req, res, db));
app.put("/image", (req, res) => handleImage(req, res, db));
app.post("/imageUrl", (req, res) => handleApiCall(req, res));

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
