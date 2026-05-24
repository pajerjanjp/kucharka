import { useState } from "react";
import RecipeList from "./pages/RecipeList.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import RecipeCreate from "./pages/RecipeCreate.jsx";
import IngredientManage from "./pages/IngredientManage.jsx";

export default function App() {
  const [page, setPage] = useState("list");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  function openList() {
    setSelectedRecipeId(null);
    setPage("list");
  }

  function openDetail(id) {
    setSelectedRecipeId(id);
    setPage("detail");
  }

  function openCreate() {
    setSelectedRecipeId(null);
    setPage("create");
  }

  function openIngredients() {
    setSelectedRecipeId(null);
    setPage("ingredients");
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={openList} type="button">Kuchařka</button>
        <nav>
          <button onClick={openList} type="button">Seznam receptů</button>
          <button onClick={openCreate} type="button">Nový recept</button>
          <button onClick={openIngredients} type="button">Ingredience</button>
        </nav>
      </header>

      <main className="container">
        {page === "list" && <RecipeList onOpenDetail={openDetail} onOpenCreate={openCreate} />}
        {page === "detail" && selectedRecipeId && <RecipeDetail recipeId={selectedRecipeId} onBack={openList} />}
        {page === "create" && <RecipeCreate onSaved={openList} onCancel={openList} />}
        {page === "ingredients" && <IngredientManage />}
      </main>
    </div>
  );
}
