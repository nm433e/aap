// Theme and navbar functionality
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.showTranslations = localStorage.getItem('showTranslations') !== 'false';
        this.init();
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Create navbar
        this.createNavbar();
        
        // Set initial translation state
        this.updateTranslations();
    }

    createNavbar() {
        const navbar = document.createElement('nav');
        navbar.className = 'navbar';
        
        // Create wrapper div
        const navbarWrapper = document.createElement('div');
        navbarWrapper.className = 'navbar-wrapper';
        
        // Left side with home and theme toggle
        const navbarLeft = document.createElement('div');
        navbarLeft.className = 'navbar-left';
        
        // Home button
        const homeButton = document.createElement('button');
        homeButton.className = 'home-button';
        homeButton.innerHTML = '<i class="fas fa-home"></i>';
        homeButton.title = 'Home';
        homeButton.onclick = () => window.location.href = 'index.html';
        
        // Theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = this.theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        themeToggle.title = this.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
        themeToggle.onclick = () => this.toggleTheme();
        
        // Language toggle button
        const langToggle = document.createElement('button');
        langToggle.className = 'lang-toggle';
        if (this.showTranslations) langToggle.classList.add('active');
        langToggle.innerHTML = '<i class="fas fa-language"></i>';
        langToggle.title = this.showTranslations ? 'Hide translations' : 'Show translations';
        langToggle.onclick = () => this.toggleTranslations();
        
        navbarLeft.appendChild(homeButton);
        navbarLeft.appendChild(themeToggle);
        navbarLeft.appendChild(langToggle);
        
        // Right side with search
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchInput = document.createElement('input');
        searchInput.className = 'search-input';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search particles...';
        
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchResults);
        
        navbarWrapper.appendChild(navbarLeft);
        navbarWrapper.appendChild(searchContainer);
        navbar.appendChild(navbarWrapper);
        
        document.body.insertBefore(navbar, document.body.firstChild);
        
        // Initialize search functionality
        this.search = new ParticleSearch(searchInput, searchResults);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Update theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.innerHTML = this.theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        themeToggle.title = this.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }

    toggleTranslations() {
        this.showTranslations = !this.showTranslations;
        localStorage.setItem('showTranslations', this.showTranslations);
        this.updateTranslations();
        
        // Update language toggle button
        const langToggle = document.querySelector('.lang-toggle');
        langToggle.classList.toggle('active', this.showTranslations);
        langToggle.title = this.showTranslations ? 'Hide translations' : 'Show translations';
    }

    updateTranslations() {
        const englishElements = document.querySelectorAll('.english');
        englishElements.forEach(el => {
            el.classList.toggle('hidden', !this.showTranslations);
        });
    }
}

// Search functionality
class ParticleSearch {
    constructor(searchInput, searchResults) {
        this.searchInput = searchInput;
        this.searchResults = searchResults;
        this.particles = [];
        this.loadParticles();
        this.addEventListeners();
    }

    async loadParticles() {
        try {
            const response = await fetch('particles.json');
            this.particles = await response.json();
        } catch (error) {
            console.error('Error loading particles data:', error);
        }
    }

    addEventListeners() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    handleSearch() {
        const query = this.searchInput.value.toLowerCase().trim();
        if (query.length < 1) {
            this.searchResults.classList.remove('active');
            return;
        }

        const results = this.particles.filter(particle => {
            return particle.japanese.toLowerCase().includes(query) ||
                   particle.english.toLowerCase().includes(query);
        });

        this.displayResults(results);
    }

    displayResults(results) {
        this.searchResults.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResults.classList.remove('active');
            return;
        }

        results.forEach(particle => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="japanese">${particle.japanese}</div>
                <div class="english">${particle.english}</div>
            `;
            
            resultItem.addEventListener('click', () => {
                window.location.href = particle.url;
            });
            
            this.searchResults.appendChild(resultItem);
        });

        this.searchResults.classList.add('active');
    }

    handleClickOutside(event) {
        if (!event.target.closest('.search-container')) {
            this.searchResults.classList.remove('active');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 