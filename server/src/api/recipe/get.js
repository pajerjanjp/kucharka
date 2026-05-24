import recipeDao from "../../dao/recipe-dao.js";
import ingredientDao from "../../dao/ingredient-dao.js";

export default async function recipeGet(req, res) {
  try {
    const { id } = req.query;

    const recipe = await recipeDao.get(id);

    if (!recipe) {
      return res.status(404).json({
        code: "recipeNotFound",
        message: "Recept neexistuje."
      });
    }

    const ingredientMap = {};
    const allIngredients = await ingredientDao.list();

    for (const ingredient of allIngredients) {
      ingredientMap[ingredient.id] = ingredient;
    }

    res.json({
      ...recipe,
      ingredientMap
    });
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
