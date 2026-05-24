const ingredientSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 1, maxLength: 100 }
  },
  required: ["id", "name"],
  additionalProperties: false
};

export default ingredientSchema;
