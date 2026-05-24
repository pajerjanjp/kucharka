import recipeIngredientLinkSchema from "./recipe-ingredient-link-schema.js";

const recipeSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 1, maxLength: 150 },
    description: { type: "string", maxLength: 500 },
    preparationSteps: { type: "string", minLength: 1 },
    rating: { type: "number", minimum: 0, maximum: 5 },
    ingredientList: {
      type: "array",
      items: recipeIngredientLinkSchema,
      minItems: 1
    }
  },
  required: ["id", "name", "description", "preparationSteps", "rating", "ingredientList"],
  additionalProperties: false
};

export default recipeSchema;
