import ingredientDao from "../../dao/ingredient-dao.js";

export default async function ingredientGet(req, res) {
  try {
    const { id } = req.query;

    const ingredient = await ingredientDao.get(id);

    if (!ingredient) {
      return res.status(404).json({
        code: "ingredientNotFound",
        message: "Ingredience neexistuje."
      });
    }

    res.json(ingredient);
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
