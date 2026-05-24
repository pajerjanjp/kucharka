import ajv from "../../validation/ajv.js";
import recipeDao from "../../dao/recipe-dao.js";
import ingredientDao from "../../dao/ingredient-dao.js";

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 150 },
    description: { type: "string", maxLength: 500 },
    preparationSteps: { type: "string", minLength: 1 },
    rating: { type: "number", minimum: 0, maximum: 5 },
    ingredientList: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          ingredientId: { type: "string" },
          amount: { type: "number", exclusiveMinimum: 0 },
          unit: { type: "string", minLength: 1, maxLength: 20 }
        },
        required: ["ingredientId", "amount", "unit"],
        additionalProperties: false
      }
    }
  },
  required: ["name", "description", "preparationSteps", "rating", "ingredientList"],
  additionalProperties: false
};

const validate = ajv.compile(schema);

export default async function recipeCreate(req, res) {
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

    const allIngredients = await ingredientDao.list();
    const ingredientIds = new Set(allIngredients.map((item) => item.id));

    for (const item of dtoIn.ingredientList) {
      if (!ingredientIds.has(item.ingredientId)) {
        return res.status(400).json({
          code: "ingredientDoesNotExist",
          message: `Ingredience s id ${item.ingredientId} neexistuje.`
        });
      }
    }

    const newRecipe = await recipeDao.create({
      name: dtoIn.name.trim(),
      description: dtoIn.description.trim(),
      preparationSteps: dtoIn.preparationSteps.trim(),
      rating: dtoIn.rating,
      ingredientList: dtoIn.ingredientList
    });

    res.status(201).json(newRecipe);
  } catch (e) {
    res.status(500).json({
      code: "internalServerError",
      message: "Došlo k neočekávané chybě."
    });
  }
}
