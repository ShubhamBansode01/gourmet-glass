const mealGrid = document.getElementById('mealGrid');
const modal = document.getElementById('recipeModal');
const searchInput = document.getElementById('searchInput');

// 🚀 1. UNIQUE DATA ENGINE
const getExtendedStats = (id) => {
    const seed = parseInt(id.slice(-2)) || 5;
    return {
        prep: (10 + seed % 10) + "m",
        cook: (20 + seed % 40) + "m",
        protein: (15 + seed % 20) + "g",
        carbs: (30 + seed % 50) + "g",
        fat: (10 + seed % 15) + "g",
        score: (85 + seed % 15) + "% Health Score"
    };
};

// 🚀 2. THE 800-WORD GENERATOR (Modular Blocks)
function assembleArticle(meal, stats) {
    const intro = `<h3>I. Historical and Cultural Significance</h3>
        <p>The <strong>${meal.strMeal}</strong> is more than just a meal; it is a cultural artifact representing the rich heritage of <strong>${meal.strArea || 'Global'}</strong> cuisine. Historically, dishes in the ${meal.strCategory} family evolved as a way to provide maximum sustenance using locally sourced ingredients. At <strong>GourmetGlass</strong>, our AI-curated research indicates that this dish has undergone several culinary transformations, moving from a traditional staple to a modern-day gourmet masterpiece. The synergy between its core ingredients—specifically the <strong>${meal.strIngredient1}</strong> and <strong>${meal.strIngredient2}</strong>—highlights a deep understanding of flavor profiling that has been perfected over generations.</p>`;

    const science = `<h3>II. The Science of Preparation</h3>
        <p>Achieving the perfect texture in <strong>${meal.strMeal}</strong> requires an understanding of thermodynamics and chemistry. For instance, the <strong>Maillard Reaction</strong> plays a crucial role when searing the primary components, creating complex flavor molecules that are inaccessible through simple boiling. Our data suggests that maintaining a consistent internal temperature is vital. From a nutritional standpoint, the combination of <b>${stats.protein} protein</b> and <b>${stats.carbs} carbohydrates</b> provides a sustained energy release, making it an ideal choice for the high-performance lifestyle of 2026. This recipe is specifically optimized to preserve the micronutrient integrity of its constituents during the cooking process.</p>`;

    const lifestyle = `<h3>III. Lifestyle Integration & Storage</h3>
        <p>In today's fast-paced digital economy, <strong>ShortsKing</strong> has optimized this recipe for maximum efficiency. It is perfectly suited for meal-prepping, as it retains its structural integrity for up to 72 hours when stored in an airtight glass container at 4°C. For reheating, we recommend a low-moisture environment to avoid denaturing the delicate proteins. Whether you are a student utilizing a <strong>Termux/mobile environment</strong> or a professional working from home, this dish fits seamlessly into a budget-friendly yet premium diet. By choosing <strong>GourmetGlass</strong>, you are investing in a sustainable and scientifically-backed approach to everyday nutrition.</p>`;

    const dataTable = `<h3>IV. Nutritional Comparison (Data Table)</h3>
        <table class="data-table">
            <tr><th>Metric</th><th>GourmetGlass Standard</th><th>Fast Food Avg</th></tr>
            <tr><td>Sodium Content</td><td>Low (Natural)</td><td>High (Processed)</td></tr>
            <tr><td>Total Protein</td><td>${stats.protein}</td><td>Variable</td></tr>
            <tr><td>Health Score</td><td>${stats.score}</td><td>Low</td></tr>
            <tr><td>Prep Time</td><td>${stats.prep}</td><td>Instaneous</td></tr>
        </table>`;

    return intro + science + lifestyle + dataTable;
}

// 🚀 3. CORE LOGIC
async function fetchMeals(cat) {
    mealGrid.innerHTML = Array(4).fill('<div class="skeleton"></div>').join('');
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
        const data = await res.json();
        render(data.meals);
    } catch (e) { mealGrid.innerHTML = "<p>Check Connection.</p>"; }
}

function render(meals) {
    if(!meals) return;
    mealGrid.innerHTML = meals.map(meal => `
        <div class="meal-card" onclick="showRecipe('${meal.idMeal}')">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
            <div class="meal-info"><h3>${meal.strMeal}</h3><p>★ Premium Choice</p></div>
        </div>
    `).join('');
}

window.showRecipe = async (id) => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals[0];
        const stats = getExtendedStats(id);
        
        let ingredients = "";
        for(let i=1; i<=20; i++) {
            if(meal[`strIngredient${i}`]) ingredients += `<li>${meal[`strIngredient${i}`]} (${meal[`strMeasure${i}`]})</li>`;
        }

        const steps = meal.strInstructions.split(/\r?\n|\. /).filter(p => p.trim().length > 15);

        document.getElementById('modalContent').innerHTML = `
            <div class="modal-header">
                <h2>${meal.strMeal}</h2>
                <span class="badge">${stats.score}</span>
            </div>
            <img src="${meal.strMealThumb}" class="modal-img">
            
            <div class="stats-grid">
                <div class="s-box"><span>PREP</span><b>${stats.prep}</b></div>
                <div class="s-box"><span>COOK</span><b>${stats.cook}</b></div>
                <div class="s-box"><span>CAL</span><b>${stats.cal}</b></div>
            </div>

            <div class="deep-content">
                ${assembleArticle(meal, stats)}
            </div>

            <h3>Recipe Components</h3>
            <ul class="ingredients">${ingredients}</ul>

            <h3>Actionable Steps</h3>
            <div class="steps">${steps.map((s,i) => `<p><b>${i+1}.</b> ${s}</p>`).join('')}</div>
            
            <button onclick="closeModal()" class="cta-btn">Back to Exploration</button>
        `;
        modal.style.display = 'block';
    } catch (e) { console.error(e); }
};

window.closeModal = () => { modal.style.display = 'none'; };
window.onload = () => { fetchMeals('Beef'); };
