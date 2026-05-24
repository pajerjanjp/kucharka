const recipeIngredientLinkSchema = {
  type: "object",
  properties: {
    ingredientId: { type: "string" },
    amount: { type: "number", exclusiveMinimum: 0 },
    unit: { type: "string", minLength: 1, maxLength: 20 }
  },
  required: ["ingredientId", "amount", "unit"],
  additionalProperties: false
};

export default recipeIngredientLinkSchema;
