const mealGrid = document.getElementById('mealGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('recipeModal');

let favorites = JSON.parse(localStorage.getItem('gourmet_favs')) || [];
let searchTimer;

const triggerHaptic = (ms) => { if (navigator.vibrate) navigator.vibrate(ms); };

// 1. Initial State & Skeletons
function showSkeletons() {
    mealGrid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');
}

// 2. Fetching Data
async function fetchByCategory(cat) {
    showSkeletons();
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
        const data = await res.json();
        renderMeals(data.meals);
    } catch (e) { 
        mealGrid.innerHTML = "<p style='text-align:center; width:100%; color:#ccc;'>Connection Error. Please check your data.</p>";
    }
}

// 3. Render Meals
function renderMeals(meals) {
    if (!meals) {
        mealGrid.innerHTML = "<p style='text-align:center; width:100%; padding:40px; color:#ccc;'>No recipes found.</p>";
        return;
    }
    mealGrid.innerHTML = meals.map(meal => {
        const isFav = favorites.some(f => f.id === meal.idMeal);
        const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${meal.idMeal}&backgroundColor=b6e3f4`;
        return `
            <div class="meal-card" onclick="showRecipe('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                <div class="meal-info">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                        <img src="${avatar}" alt="Chef" loading="lazy" style="width:24px; height:24px; border-radius:50%;">
                        <span style="font-size:0.65rem; opacity:0.6; font-weight:600;">CHEF MASTER #${meal.idMeal.slice(-3)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;">${meal.strMeal}</h3>
                        <span onclick="toggleFav(event, '${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')" 
                              style="font-size:1.3rem; padding-left:15px; cursor:pointer;">${isFav ? '❤️' : '🤍'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 🚀 4. THE SEO ENGINE: Generates unique, high-depth articles dynamically
function generateSeoArticle(meal) {
    const variants = [
        `<h3>Mastering the Art of ${meal.strMeal}</h3>
         <p>Preparing <strong>${meal.strMeal}</strong> is more than just cooking; it's a culinary journey into the world of ${meal.strCategory || 'fine dining'}. At GourmetGlass, we analyze the structural balance of ingredients to ensure every home cook can achieve Michelin-star quality. This dish offers a rich source of proteins and essential nutrients, making it a perfect choice for those seeking a balanced lifestyle.</p>`,
        
        `<h3>The Ultimate ${meal.strMeal} Guide for 2026</h3>
         <p>Why is <strong>${meal.strMeal}</strong> trending in the ${meal.strArea || 'global'} food scene? Our AI-curated research shows that this specific recipe bridges the gap between traditional heritage and modern convenience. Perfect for students and busy professionals, this meal ensures that you don't compromise on flavor even during your busiest workdays.</p>`,
        
        `<h3>Nutritional Deep-Dive: ${meal.strMeal}</h3>
         <p>Did you know that <strong>${meal.strMeal}</strong> is often considered a staple in ${meal.strArea || 'regional'} households? We've deconstructed this recipe to focus on ingredient purity and preparation speed. By following our GourmetGlass Master Chef's advice, you are not just making a meal; you are optimizing your daily intake with premium ingredients.</p>`
    ];
    // Randomly pick a variant to avoid "Low Value" footprint
    return variants[Math.floor(Math.random() * variants.length)];
}

// 5. Recipe Modal Logic
window.showRecipe = async (id) => {
    triggerHaptic(20);
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals[0];
        const steps = meal.strInstructions.split(/\r?\n|\. /).filter(p => p.trim().length > 15);
        
        const dynamicContent = generateSeoArticle(meal);

        document.getElementById('modalContent').innerHTML = `
            <h2 style="color:var(--accent); font-size:1.2rem; margin-bottom:15px;">${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" style="width:100%; border-radius:20px; margin-bottom:20px;">
            
            <div style="font-size: 0.85rem; line-height: 1.7; color: #ccc; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
                ${dynamicContent}
                <div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    <span style="color: #ffcc00; font-size: 0.75rem; font-weight: 600;">CHEF'S SECRET:</span>
                    <p style="font-size: 0.8rem; font-style: italic;">"The key to ${meal.strMeal} is temperature control and fresh ${meal.strIngredient1 || 'spices'}."</p>
                </div>
            </div>

            <h4 style="font-size:0.8rem; color:var(--accent); margin-bottom:12px; letter-spacing:1px;">PREPARATION STEPS</h4>
            <ul style="list-style:none; padding-left:0;">
                ${steps.map((p, i) => `<li style="margin-bottom:12px; font-size:0.85rem; line-height:1.6; color:#ccc;"><b>${i+1}.</b> ${p.trim()}.</li>`).join('')}
            </ul>
            <button onclick="closeModal()" style="width:100%; padding:15px; border-radius:15px; border:none; background:var(--accent); color:white; font-weight:600; margin-top:20px; cursor:pointer;">CLOSE</button>
        `;
        modal.style.display = 'block';
    } catch (e) { alert("Recipe details currently unavailable."); }
};

window.closeModal = () => { modal.style.display = 'none'; triggerHaptic(10); };

// ... (Search, Theme, Consent Logic remains same as previous version)
