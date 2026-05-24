import { readJsonFile, writeJsonFile } from "../utils/file-storage.js";
import { generateId } from "../utils/id.js";

const STORAGE_PATH = "storage/recipes.json";

async function list(filter = {}) {
  const items = await readJsonFile(STORAGE_PATH);

  let result = items;

  if (filter.name) {
    const search = filter.name.trim().toLowerCase();
    result = result.filter((item) =>
      item.name.toLowerCase().includes(search)
    );
  }

  if (filter.ingredientId) {
    result = result.filter((item) =>
      item.ingredientList.some(
        (ingredientLink) => ingredientLink.ingredientId === filter.ingredientId
      )
    );
  }

  return result;
}

async function get(id) {
  const items = await readJsonFile(STORAGE_PATH);
  return items.find((item) => item.id === id);
}

async function create(recipe) {
  const items = await readJsonFile(STORAGE_PATH);

  const newRecipe = {
    id: generateId(),
    name: recipe.name,
    description: recipe.description,
    preparationSteps: recipe.preparationSteps,
    rating: recipe.rating,
    ingredientList: recipe.ingredientList
  };

  items.push(newRecipe);
  await writeJsonFile(STORAGE_PATH, items);

  return newRecipe;
}

async function update(recipe) {
  const items = await readJsonFile(STORAGE_PATH);
  const index = items.findIndex((item) => item.id === recipe.id);

  if (index === -1) return null;

  items[index] = {
    ...items[index],
    name: recipe.name,
    description: recipe.description,
    preparationSteps: recipe.preparationSteps,
    rating: recipe.rating,
    ingredientList: recipe.ingredientList
  };

  await writeJsonFile(STORAGE_PATH, items);
  return items[index];
}

async function remove(id) {
  const items = await readJsonFile(STORAGE_PATH);
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) return false;

  await writeJsonFile(STORAGE_PATH, filtered);
  return true;
}

export default {
  list,
  get,
  create,
  update,
  remove
};
