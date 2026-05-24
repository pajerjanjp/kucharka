import { useEffect, useState } from "react";
import { listRecipes } from "../api.js";

export default function RecipeList({ onOpenDetail, onOpenCreate }) {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [ingredientId, setIngredientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRecipes(filter = {}) {
    setLoading(true);
    setError("");
    try {
      const data = await listRecipes(filter);
      setRecipes(data.itemList || []);
      setIngredients(data.ingredientList || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    loadRecipes({ name: name.trim(), ingredientId });
  }

  function clearFilter() {
    setName("");
    setIngredientId("");
    loadRecipes();
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Seznam receptů</h1>
        <button onClick={onOpenCreate} type="button">Vytvořit recept</button>
      </div>

      <form className="filter" onSubmit={handleSubmit}>
        <label>
          Název receptu
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="např. rizoto" />
        </label>
        <label>
          Ingredience
          <select value={ingredientId} onChange={(e) => setIngredientId(e.target.value)}>
            <option value="">Všechny ingredience</option>
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Filtrovat</button>
        <button type="button" onClick={clearFilter}>Zrušit filtr</button>
      </form>

      {loading && <p>Načítám...</p>}
      {error && <p className="error">{error}</p>}

      <div className="list">
        {recipes.map((recipe) => (
          <article className="card" key={recipe.id}>
            <div>
              <h2>{recipe.name}</h2>
              <p>{recipe.description}</p>
              <p>Hodnocení: {recipe.rating}/5</p>
            </div>
            <button onClick={() => onOpenDetail(recipe.id)} type="button">Zobrazit</button>
          </article>
        ))}
      </div>

      {!loading && recipes.length === 0 && <p>Nebyly nalezeny žádné recepty.</p>}
    </section>
  );
}
