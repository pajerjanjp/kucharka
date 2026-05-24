import ingredientDao from "../../dao/ingredient-dao.js";

export default async function ingredientList(req, res) {
  try {
    const itemList = await ingredientDao.list();
    res.json({ itemList });
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
