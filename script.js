// GourmetGlass Premium Script - Clean Version (No Family Names)
const mealGrid = document.getElementById('mealGrid');

async function fetchByCategory(cat) {
    console.log("Fetching recipes for:", cat);
    
    // Check if mealGrid exists
    if (!mealGrid) {
        console.error("Critical Error: mealGrid element missing from HTML!");
        return;
    }

    // Reset grid with loading state
    mealGrid.innerHTML = `<p style="color: white; text-align: center; grid-column: 1/-1; padding: 20px;">
        👨‍🍳 AI Chef is preparing ${cat} recipes...
    </p>`;
    
    try {
        // Fetching data from API
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
        const data = await response.json();
        
        if (data.meals) {
            console.log("Recipes loaded successfully:", data.meals.length);
            
            // Map data to HTML cards
            mealGrid.innerHTML = data.meals.map(meal => `
                <div class="meal-card" onclick="showRecipe('${meal.idMeal}')" 
                     style="background: rgba(255,255,255,0.05); border-radius: 15px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: transform 0.3s ease;">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" style="width: 100%; display: block; object-fit: cover; aspect-ratio: 1/1;">
                    <div style="padding: 12px;">
                        <h3 style="font-size: 0.85rem; color: #fff; margin: 0; font-weight: 400; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${meal.strMeal}</h3>
                    </div>
                </div>
            `).join('');
        } else {
            mealGrid.innerHTML = "<p style='color: white; text-align: center; grid-column: 1/-1;'>No recipes found in this category.</p>";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        mealGrid.innerHTML = `<div style="color: #ff6b6b; text-align: center; grid-column: 1/-1; padding: 20px;">
            <p>Chef is busy! (Connection Error)</p>
            <button onclick="location.reload()" style="background: var(--accent, #ff6b6b); color: white; border: none; padding: 10px 20px; border-radius: 10px; margin-top: 10px;">Try Again</button>
        </div>`;
    }
}

// Global modal function (Basic Version to ensure visibility)
window.showRecipe = (id) => {
    alert("Recipe ID: " + id + " clicked! Preparing details...");
    // Future: Add the full modal logic here once the grid is working
};

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    fetchByCategory('Beef');
});

// Category Switcher Logic
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        // Add active to current
        e.currentTarget.classList.add('active');
        // Fetch new category
        fetchByCategory(e.currentTarget.dataset.category);
    });
});
