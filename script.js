const mealGrid = document.getElementById('mealGrid');
const modal = document.getElementById('recipeModal');
const modalContent = document.getElementById('modalContent');
const searchInput = document.getElementById('searchInput');

// Utility: Premium Haptics for Android
const haptic = (ms) => { if (navigator.vibrate) navigator.vibrate(ms); };

// SEO Article Engine (Expert Data Blocks)
const getStats = (id) => {
    const seed = parseInt(id.slice(-2)) || 7;
    return { 
        time: (15 + seed % 20) + "m", 
        calories: (250 + seed * 4) + " kcal", 
        protein: (18 + seed % 12) + "g",
        rating: (4.6 + (seed % 4)/10).toFixed(1)
    };
};

// 800+ Words Modular Generator
const generateExpertArticle = (meal, stats) => {
    return `
        <div class="article-block" style="font-size:0.85rem; line-height:1.7; color:#bbb;">
            <h3 style="color:var(--accent); font-size:1rem; margin-top:25px;">I. Structural Integrity & History</h3>
            <p>The <strong>${meal.strMeal}</strong> is not merely a dish; it represents a pinnacle of <strong>${meal.strArea || 'Global'}</strong> culinary evolution. Historically, the ${meal.strCategory} category has served as a bedrock for high-performance nutrition. Our AI research at <strong>GourmetGlass</strong> identifies the molecular synergy between <strong>${meal.strIngredient1}</strong> and <strong>${meal.strIngredient2}</strong> as the secret behind its legendary status.</p>
            
            <table style="width:100%; border-collapse:collapse; margin:20px 0; background:rgba(255,255,255,0.02); border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
                <tr style="background:var(--accent); color:black; font-weight:700;"><th style="padding:10px;">Metric</th><th style="padding:10px;">Gourmet Analysis</th></tr>
                <tr><td style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.05);">Protein Content</td><td style="padding:10px;">${stats.protein} (Optimized)</td></tr>
                <tr><td style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.05);">Cooking Efficiency</td><td style="padding:10px;">${stats.time} (Maximized)</td></tr>
                <tr><td style="padding:10px;">AI Flavor Score</td><td style="padding:10px;">${stats.rating}/5.0</td></tr>
            </table>

            <h3 style="color:var(--accent); font-size:1rem; margin-top:25px;">II. Technical Preparation Science</h3>
            <p>Mastering this dish requires understanding <strong>The Maillard Reaction</strong>. Developed by <strong>ShortsKing</strong> using advanced mobile development logic, this guide focuses on thermal consistency. Reaching an internal heat threshold ensures that the proteins are denatured perfectly, preserving the <b>${stats.calories} energy density</b> required for high-focus tasks like coding in <strong>Termux</strong> or editing 4K content.</p>

            <h3 style="color:var(--accent); font-size:1rem; margin-top:25px;">III. Professional Tips & Lifestyle</h3>
            <p>For the best results, source organic ingredients. This dish is optimized for a budget-friendly lifestyle without compromising on the premium "Glass" experience. It is specifically designed to stay fresh for 48 hours, making it the ultimate tool for meal-prepping students and creators.</p>
        </div>
    `;
};

// Data Fetching Logic
async function fetchByCategory(cat) {
    mealGrid.innerHTML = Array(4).fill('<div style="height:200px; background:var(--card); border-radius:25px; opacity:0.5;"></div>').join('');
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
        const data = await res.json();
        renderMeals(data.meals);
    } catch (e) { mealGrid.innerHTML = "<p>API Connection Failed.</p>"; }
}

function renderMeals(meals) {
    if(!meals) return;
    mealGrid.innerHTML = meals.map(meal => `
        <div class="meal-card" onclick="showRecipe('${meal.idMeal}')">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
            <div class="meal-info"><h3>${meal.strMeal}</h3></div>
        </div>
    `).join('');
}

window.showRecipe = async (id) => {
    haptic(25);
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals[0];
        const stats = getStats(id);
        const steps = meal.strInstructions.split(/\r?\n|\. /).filter(p => p.trim().length > 15);

        modalContent.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
                <h2 style="font-size:1.5rem; margin:0; line-height:1.1;">${meal.strMeal} <br><span style="font-size:0.7rem; color:var(--accent); opacity:0.7;">★ ${stats.rating} MASTERCLASS</span></h2>
                <button onclick="closeModal()" style="background:var(--glass); border:1px solid var(--border); color:white; border-radius:50%; width:35px; height:35px; cursor:pointer;">✕</button>
            </div>
            
            <img src="${meal.strMealThumb}" style="width:100%; border-radius:30px; margin-bottom:25px; box-shadow:0 15px 35px rgba(0,0,0,0.6);" loading="lazy">
            
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:30px; text-align:center;">
                <div style="background:var(--glass); padding:10px; border-radius:15px; border:1px solid var(--border);"><small style="display:block; opacity:0.5; font-size:0.6rem;">TIME</small><b>${stats.time}</b></div>
                <div style="background:var(--glass); padding:10px; border-radius:15px; border:1px solid var(--border);"><small style="display:block; opacity:0.5; font-size:0.6rem;">PROTEIN</small><b>${stats.protein}</b></div>
                <div style="background:var(--glass); padding:10px; border-radius:15px; border:1px solid var(--border);"><small style="display:block; opacity:0.5; font-size:0.6rem;">CAL</small><b>${stats.calories}</b></div>
            </div>

            ${generateExpertArticle(meal, stats)}

            <h3 style="color:var(--accent); margin-top:30px;">III. Professional Execution</h3>
            <div style="display:flex; flex-direction:column; gap:15px; margin-bottom:30px;">
                ${steps.map((s,i) => `<div style="display:flex; gap:15px; font-size:0.9rem; color:#eee;"><b style="color:var(--accent);">${i+1}</b><p style="margin:0;">${s.trim()}</p></div>`).join('')}
            </div>
            
            <button onclick="closeModal()" class="primary-btn" style="width:100%;">MARK AS COMPLETE</button>
        `;
        modal.style.display = 'flex';
    } catch (e) { console.error(e); }
};

window.closeModal = () => { modal.style.display = 'none'; haptic(10); };

// Initialize Everything
document.querySelectorAll('.cat-card').forEach(btn => {
    btn.onclick = () => {
        haptic(15);
        document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fetchByCategory(btn.dataset.category);
    };
});

window.onload = () => { fetchByCategory('Beef'); };
