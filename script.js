document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });

    // Fetch and display recipes
    const recipesContainer = document.getElementById('featured-recipes') || document.getElementById('all-recipes');
    let allRecipes = [];

    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            allRecipes = [...data.featured, ...data.premium];
            displayRecipes(allRecipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredRecipes = allRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(searchTerm) || 
            recipe.description.toLowerCase().includes(searchTerm)
        );
        displayRecipes(filteredRecipes);
    }

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Filter functionality
    const allFilterButton = document.getElementById('all-filter');
    const vegFilterButton = document.getElementById('veg-filter');
    const nonVegFilterButton = document.getElementById('non-veg-filter');

    function filterRecipes(filterType) {
        let filteredRecipes;
        if (filterType === 'all') {
            filteredRecipes = allRecipes;
        } else {
            filteredRecipes = allRecipes.filter(recipe => recipe.type === filterType);
        }
        displayRecipes(filteredRecipes);
    }

    if (allFilterButton && vegFilterButton && nonVegFilterButton) {
        allFilterButton.addEventListener('click', () => {
            setActiveFilter(allFilterButton);
            filterRecipes('all');
        });
        vegFilterButton.addEventListener('click', () => {
            setActiveFilter(vegFilterButton);
            filterRecipes('veg');
        });
        nonVegFilterButton.addEventListener('click', () => {
            setActiveFilter(nonVegFilterButton);
            filterRecipes('non-veg');
        });
    }

    function setActiveFilter(activeButton) {
        [allFilterButton, vegFilterButton, nonVegFilterButton].forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    // Display recipes
    function displayRecipes(recipes) {
        if (recipesContainer) {
            recipesContainer.innerHTML = '';
            recipes.forEach(recipe => {
                const recipeCard = createRecipeCard(recipe);
                recipesContainer.appendChild(recipeCard);
            });
        }
    }

    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="card--img">
            <div class="card--content">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
            </div>
            <div class="card--info">
                <div class="recipe-rating">
                    ${'★'.repeat(recipe.rating)}${'☆'.repeat(5 - recipe.rating)}
                </div>
                <div class="card--link">
                    <a href="recipes.html#${recipe.id}">View Recipe</a>
                </div>
            </div>
        `;
        return card;
    }

    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically integrate with a payment gateway
            alert('Thank you for your purchase! You now have access to premium recipes.');
            // Redirect to the premium recipes page or show a success message
            window.location.href = 'premium.html';
        });
    }
});