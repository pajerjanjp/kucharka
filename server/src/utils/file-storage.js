import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readJsonFile(relativePath) {
  const filePath = path.join(__dirname, "..", relativePath);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function writeJsonFile(relativePath, data) {
  const filePath = path.join(__dirname, "..", relativePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
