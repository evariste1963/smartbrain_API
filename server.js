import express from "express";
import { json } from "express/lib/response";

const app = express();
//app.use(express.urlencoded({extended: false}));
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success!");
  } else {
    res.status(400).json("error loggin in");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users.at(-1)); // same as database.users[database.users.length-1]
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return json(user);
    }
  });
  if (!found) {
    res.status(400).json("profile not found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*
/--> res => this is working
/signin --> POST = sucess/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
