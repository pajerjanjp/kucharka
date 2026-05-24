import express from "express";

import recipeCreate from "./api/recipe/create.js";
import recipeGet from "./api/recipe/get.js";
import recipeList from "./api/recipe/list.js";
import recipeUpdate from "./api/recipe/update.js";
import recipeDelete from "./api/recipe/delete.js";

import ingredientCreate from "./api/ingredient/create.js";
import ingredientGet from "./api/ingredient/get.js";
import ingredientList from "./api/ingredient/list.js";
import ingredientUpdate from "./api/ingredient/update.js";
import ingredientDelete from "./api/ingredient/delete.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Kuchařka backend běží." });
});

app.post("/recipe/create", recipeCreate);
app.get("/recipe/get", recipeGet);
app.get("/recipe/list", recipeList);
app.put("/recipe/update", recipeUpdate);
app.delete("/recipe/delete", recipeDelete);

app.post("/ingredient/create", ingredientCreate);
app.get("/ingredient/get", ingredientGet);
app.get("/ingredient/list", ingredientList);
app.put("/ingredient/update", ingredientUpdate);
app.delete("/ingredient/delete", ingredientDelete);

export default app;
