import { useEffect, useMemo, useState } from "react";
import { deleteRecipe, getRecipe } from "../api.js";

export default function RecipeDetail({ recipeId, onBack }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      setError("");
      try {
        const data = await getRecipe(recipeId);
        setRecipe(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [recipeId]);

  const ingredientMap = useMemo(() => recipe?.ingredientMap || {}, [recipe]);

  async function handleDelete() {
    if (!confirm("Opravdu chcete recept smazat?")) return;

    try {
      await deleteRecipe(recipeId);
      onBack();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p>Načítám...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return null;

  return (
    <section>
      <button onClick={onBack} type="button">Zpět na seznam</button>

      <article className="detail">
        <h1>{recipe.name}</h1>
        <p>{recipe.description}</p>
        <p>Hodnocení: {recipe.rating}/5</p>

        <h2>Ingredience</h2>
        <ul>
          {recipe.ingredientList.map((item) => (
            <li key={item.ingredientId}>
              {ingredientMap[item.ingredientId]?.name || "Neznámá ingredience"} – {item.amount} {item.unit}
            </li>
          ))}
        </ul>

        <h2>Postup přípravy</h2>
        <p className="steps">{recipe.preparationSteps}</p>

        <button className="danger" onClick={handleDelete} type="button">Smazat recept</button>
      </article>
    </section>
  );
}
