import { readJsonFile, writeJsonFile } from "../utils/file-storage.js";
import { generateId } from "../utils/id.js";

const STORAGE_PATH = "storage/ingredients.json";

async function list() {
  return await readJsonFile(STORAGE_PATH);
}

async function get(id) {
  const items = await list();
  return items.find((item) => item.id === id);
}

async function getByName(name) {
  const items = await list();
  return items.find(
    (item) => item.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
}

async function create(ingredient) {
  const items = await list();

  const newIngredient = {
    id: generateId(),
    name: ingredient.name
  };

  items.push(newIngredient);
  await writeJsonFile(STORAGE_PATH, items);

  return newIngredient;
}

async function update(ingredient) {
  const items = await list();
  const index = items.findIndex((item) => item.id === ingredient.id);

  if (index === -1) return null;

  items[index] = {
    ...items[index],
    name: ingredient.name
  };

  await writeJsonFile(STORAGE_PATH, items);
  return items[index];
}

async function remove(id) {
  const items = await list();
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) return false;

  await writeJsonFile(STORAGE_PATH, filtered);
  return true;
}

export default {
  list,
  get,
  getByName,
  create,
  update,
  remove
};
