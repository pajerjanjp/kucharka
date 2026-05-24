async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || "Požadavek se nepodařil.";
    throw new Error(message);
  }

  return data;
}

export function listRecipes(filter = {}) {
  const params = new URLSearchParams();
  if (filter.name) params.set("name", filter.name);
  if (filter.ingredientId) params.set("ingredientId", filter.ingredientId);

  const query = params.toString();
  return request(`/recipe/list${query ? `?${query}` : ""}`);
}

export function getRecipe(id) {
  return request(`/recipe/get?id=${encodeURIComponent(id)}`);
}

export function createRecipe(recipe) {
  return request("/recipe/create", {
    method: "POST",
    body: JSON.stringify(recipe)
  });
}

export function updateRecipe(recipe) {
  return request("/recipe/update", {
    method: "PUT",
    body: JSON.stringify(recipe)
  });
}

export function deleteRecipe(id) {
  return request(`/recipe/delete?id=${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

export function listIngredients() {
  return request("/ingredient/list");
}

export function createIngredient(ingredient) {
  return request("/ingredient/create", {
    method: "POST",
    body: JSON.stringify(ingredient)
  });
}


export function updateIngredient(ingredient) {
  return request("/ingredient/update", {
    method: "PUT",
    body: JSON.stringify(ingredient)
  });
}

export function deleteIngredient(id) {
  return request(`/ingredient/delete?id=${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}
