const express = require("express");
const app = express();

const pool = require("./db.js");

app.use(express.json());

// get all todos
app.get("/todos", async (req, res) => {
  try {
    // const allTodos = await pool.query("SELECT * FROM todo");
    // use this to not send all of the data to the client
    const allTodos = await pool.query("SELECT description FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get a single todo
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//create todos
app.post("/todos", async (req, res) => {
  console.log(req.body);
  try {
    const { description } = req.body;
    // console.log(description);
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params; // WHERE
    const { description } = req.body; // SET

    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json(`Updated ${id}`);
  } catch (err) {
    console.log(err.message);
  }
});

// delete
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json("Todo was successfully deleted");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(process.env.port || 3001, () => {
  console.log("server is listening on port 3001");
});
