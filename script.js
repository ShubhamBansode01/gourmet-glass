const mealGrid = document.getElementById('mealGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('recipeModal');
const adTop = document.getElementById('ad-segment-top');

let favorites = JSON.parse(localStorage.getItem('gourmet_favs')) || [];
let searchTimer;

const triggerHaptic = (ms) => { if (navigator.vibrate) navigator.vibrate(ms); };

// 1. Initial State & Skeletons
function showSkeletons() {
    mealGrid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');
}

// 2. Fetching API Data
async function fetchByCategory(cat) {
    showSkeletons();
    adTop.classList.remove('reveal');
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
        const data = await res.json();
        renderMeals(data.meals);
        setTimeout(() => adTop.classList.add('reveal'), 1000);
    } catch (e) { 
        mealGrid.innerHTML = "<p style='text-align:center; width:100%;'>Error connecting to server.</p>";
    }
}

// 3. Render Loop with Chef Avatars
function renderMeals(meals) {
    if (!meals) {
        mealGrid.innerHTML = "<p style='text-align:center; width:100%; padding:40px;'>No recipes found.</p>";
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
                        <img src="${avatar}" style="width:24px; height:24px; border-radius:50%; background:var(--glass-bg);">
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

// 4. Recipe Modal Logic
window.showRecipe = async (id) => {
    triggerHaptic(20);
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals[0];
        const steps = meal.strInstructions.split(/\r?\n|\. /).filter(p => p.trim().length > 15);

        document.getElementById('modalContent').innerHTML = `
            <h2 style="color:var(--accent); font-size:1.2rem; margin-bottom:15px;">${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" style="width:100%; border-radius:20px; margin-bottom:20px; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
            <h4 style="font-size:0.8rem; color:var(--accent); margin-bottom:12px; letter-spacing:1px;">PREPARATION STEPS</h4>
            <ul style="list-style:none;">
                ${steps.map((p, i) => `<li style="margin-bottom:12px; font-size:0.85rem; line-height:1.6; color:#ccc;"><b>${i+1}.</b> ${p.trim()}.</li>`).join('')}
            </ul>
            <button onclick="closeModal()" style="width:100%; padding:15px; border-radius:15px; border:none; background:var(--accent); color:white; font-weight:600; margin-top:20px; cursor:pointer;">CLOSE RECIPE</button>
        `;
        modal.style.display = 'block';
    } catch (e) { alert("Recipe details currently unavailable."); }
};

window.closeModal = () => { modal.style.display = 'none'; triggerHaptic(10); };

// 5. Smart Debounced Search
searchInput.oninput = (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
        const val = e.target.value;
        if (val.length > 2) {
            showSkeletons();
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`);
            const data = await res.json();
            renderMeals(data.meals);
        }
    }, 600);
};

// 6. Favorites & Theme
window.toggleFav = (e, id, name, img) => {
    e.stopPropagation(); triggerHaptic(40);
    const idx = favorites.findIndex(f => f.id === id);
    if (idx === -1) favorites.push({id, name, img});
    else favorites.splice(idx, 1);
    localStorage.setItem('gourmet_favs', JSON.stringify(favorites));
    e.target.innerText = idx === -1 ? '❤️' : '🤍';
};

document.getElementById('theme-toggle').onclick = () => { 
    document.body.classList.toggle('light-theme'); 
    triggerHaptic(15); 
};

// 7. Navigation Event Listeners
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.onclick = () => {
        triggerHaptic(10);
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fetchByCategory(btn.dataset.category);
    };
});

document.getElementById('fav-trigger').onclick = (e) => {
    e.preventDefault();
    triggerHaptic(20);
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    e.currentTarget.classList.add('active');
    renderMeals(favorites.map(f => ({idMeal: f.id, strMeal: f.name, strMealThumb: f.img})));
};

document.getElementById('nav-home').onclick = (e) => {
    e.preventDefault();
    triggerHaptic(20);
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    e.currentTarget.classList.add('active');
    fetchByCategory('Beef');
};

// Auto-Load
document.addEventListener('DOMContentLoaded', () => fetchByCategory('Beef'));
