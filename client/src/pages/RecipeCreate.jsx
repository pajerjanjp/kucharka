import { useEffect, useState } from "react";
import { createRecipe, listIngredients } from "../api.js";

const emptyIngredientLink = {
  ingredientId: "",
  amount: 1,
  unit: "g"
};

export default function RecipeCreate({ onSaved, onCancel }) {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    preparationSteps: "",
    rating: 0,
    ingredientList: [{ ...emptyIngredientLink }]
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await listIngredients();
        setIngredients(data.itemList || []);
      } catch (e) {
        setError(e.message);
      }
    }

    loadIngredients();
  }, []); 

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateIngredient(index, field, value) {
    setForm((current) => {
      const ingredientList = current.ingredientList.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        return {
          ...item,
          [field]: field === "amount" ? Number(value) : value
        };
      });

      return { ...current, ingredientList };
    });
  }

  function addIngredient() {
    setForm((current) => ({
      ...current,
      ingredientList: [...current.ingredientList, { ...emptyIngredientLink }]
    }));
  }

  function removeIngredient(index) {
    setForm((current) => ({
      ...current,
      ingredientList: current.ingredientList.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createRecipe({
        ...form,
        rating: Number(form.rating)
      });
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1>Vytvoření nového receptu</h1>

      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Název receptu
          <input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
        </label>

        <label>
          Popis
          <input value={form.description} onChange={(e) => updateField("description", e.target.value)} />
        </label>

        <label>
          Hodnocení
          <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => updateField("rating", e.target.value)} />
        </label>

        <label>
          Postup přípravy
          <textarea value={form.preparationSteps} onChange={(e) => updateField("preparationSteps", e.target.value)} required />
        </label>

        <h2>Ingredience</h2>
        {form.ingredientList.map((item, index) => (
          <div className="ingredient-row" key={index}>
            <select value={item.ingredientId} onChange={(e) => updateIngredient(index, "ingredientId", e.target.value)} required>
              <option value="">Vyberte ingredienci</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
              ))}
            </select>
            <input type="number" min="0.1" step="0.1" value={item.amount} onChange={(e) => updateIngredient(index, "amount", e.target.value)} required />
            <select value={item.unit} onChange={(e) => updateIngredient(index, "unit", e.target.value)} required>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
              <option value="ks">ks</option>
              <option value="lžíce">lžíce</option>
            </select>
            <button type="button" onClick={() => removeIngredient(index)}>Odebrat</button>
          </div>
        ))}

        <button type="button" onClick={addIngredient}>Přidat ingredienci</button>

        <div className="actions">
          <button type="submit" disabled={saving}>{saving ? "Ukládám..." : "Uložit"}</button>
          <button type="button" onClick={onCancel}>Zrušit</button>
        </div>
      </form>
    </section>
  );
}
