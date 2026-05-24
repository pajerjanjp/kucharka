import ajv from "../../validation/ajv.js";
import ingredientDao from "../../dao/ingredient-dao.js";

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 }
  },
  required: ["name"],
  additionalProperties: false
};

const validate = ajv.compile(schema);

export default async function ingredientCreate(req, res) {
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

    const normalizedName = dtoIn.name.trim();

    const existingIngredient = await ingredientDao.getByName(normalizedName);
    if (existingIngredient) {
      return res.status(400).json({
        code: "ingredientAlreadyExists",
        message: "Ingredience se stejným názvem už existuje."
      });
    }

    const newIngredient = await ingredientDao.create({
      name: normalizedName
    });

    res.status(201).json(newIngredient);
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
