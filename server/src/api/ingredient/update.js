import ajv from "../../validation/ajv.js";
import ingredientDao from "../../dao/ingredient-dao.js";

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 1, maxLength: 100 }
  },
  required: ["id", "name"],
  additionalProperties: false
};

const validate = ajv.compile(schema);

export default async function ingredientUpdate(req, res) {
  try {
    const dtoIn = req.body;

    const valid = validate(dtoIn);
    if (!valid) {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Vstup není validní.",
        validationErrors: validate.errors
      });
    }

    const existingIngredient = await ingredientDao.get(dtoIn.id);
    if (!existingIngredient) {
      return res.status(404).json({
        code: "ingredientNotFound",
        message: "Ingredience neexistuje."
      });
    }

    const normalizedName = dtoIn.name.trim();
    const ingredientWithSameName = await ingredientDao.getByName(normalizedName);

    if (ingredientWithSameName && ingredientWithSameName.id !== dtoIn.id) {
      return res.status(400).json({
        code: "ingredientAlreadyExists",
        message: "Ingredience se stejným názvem už existuje."
      });
    }

    const updatedIngredient = await ingredientDao.update({
      id: dtoIn.id,
      name: normalizedName
    });

    res.json(updatedIngredient);
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
