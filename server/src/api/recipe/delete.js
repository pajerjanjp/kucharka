import recipeDao from "../../dao/recipe-dao.js";

export default async function recipeDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Parametr id je povinný."
      });
    }

    const existingRecipe = await recipeDao.get(id);
    if (!existingRecipe) {
      return res.status(404).json({
        code: "recipeNotFound",
        message: "Recept neexistuje."
      });
    }

    await recipeDao.remove(id);

    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
