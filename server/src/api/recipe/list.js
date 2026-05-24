import recipeDao from "../../dao/recipe-dao.js";
import ingredientDao from "../../dao/ingredient-dao.js";

export default async function recipeList(req, res) {
  try {
    const { name, ingredientId } = req.query;

    if (ingredientId) {
      const ingredient = await ingredientDao.get(ingredientId);
      if (!ingredient) {
        return res.status(400).json({
          code: "ingredientDoesNotExist",
          message: "Filtrovaná ingredience neexistuje."
        });
      }
    }

    const itemList = await recipeDao.list({ name, ingredientId });
    const ingredientList = await ingredientDao.list();

    res.json({ itemList, ingredientList });
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
