import ingredientDao from "../../dao/ingredient-dao.js";
import recipeDao from "../../dao/recipe-dao.js";

export default async function ingredientDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Parametr id je povinný."
      });
    }

    const existingIngredient = await ingredientDao.get(id);
    if (!existingIngredient) {
      return res.status(404).json({
        code: "ingredientNotFound",
        message: "Ingredience neexistuje."
      });
    }

    const recipeList = await recipeDao.list();
    const ingredientIsUsed = recipeList.some((recipe) =>
      recipe.ingredientList.some((item) => item.ingredientId === id)
    );

    if (ingredientIsUsed) {
      return res.status(400).json({
        code: "ingredientIsUsed",
        message: "Ingredience je použita v některém receptu a nelze ji smazat."
      });
    }

    await ingredientDao.remove(id);

    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
