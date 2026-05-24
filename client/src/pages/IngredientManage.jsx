import { useEffect, useState } from "react";
import { createIngredient, deleteIngredient, listIngredients, updateIngredient } from "../api.js";

export default function IngredientManage() {
  const [ingredients, setIngredients] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadIngredients() {
    setLoading(true);
    setError("");

    try {
      const data = await listIngredients();
      setIngredients(data.itemList || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIngredients();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setError("");

    try {
      await createIngredient({ name: newName });
      setNewName("");
      await loadIngredients();
    } catch (e) {
      setError(e.message);
    }
  }

  function startEdit(ingredient) {
    setEditingId(ingredient.id);
    setEditingName(ingredient.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  async function handleUpdate(id) {
    setError("");

    try {
      await updateIngredient({ id, name: editingName });
      cancelEdit();
      await loadIngredients();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    setError("");

    const confirmed = window.confirm("Opravdu chcete smazat tuto ingredienci?");
    if (!confirmed) return;

    try {
      await deleteIngredient(id);
      await loadIngredients();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Správa ingrediencí</h1>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="inline-form" onSubmit={handleCreate}>
        <label>
          Nová ingredience
          <input value={newName} onChange={(e) => setNewName(e.target.value)} required />
        </label>
        <button type="submit">Přidat ingredienci</button>
      </form>

      <div className="list">
        {loading && <p>Načítám ingredience...</p>}

        {!loading && ingredients.length === 0 && (
          <p>Nejsou uložené žádné ingredience.</p>
        )}

        {ingredients.map((ingredient) => (
          <article className="card" key={ingredient.id}>
            {editingId === ingredient.id ? (
              <>
                <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                <div className="actions">
                  <button type="button" onClick={() => handleUpdate(ingredient.id)}>Uložit</button>
                  <button type="button" onClick={cancelEdit}>Zrušit</button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2>{ingredient.name}</h2>
                </div>
                <div className="actions">
                  <button type="button" onClick={() => startEdit(ingredient)}>Upravit</button>
                  <button className="danger" type="button" onClick={() => handleDelete(ingredient.id)}>Smazat</button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
