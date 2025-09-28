// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
});

// Mobile Navigation
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(26, 26, 26, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.backgroundColor = body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(26, 26, 26, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
    }
});

// Animate project cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const closeModal = document.getElementById('close-modal');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate form processing
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success modal
        successModal.style.display = 'block';
        
        // Auto close modal after 3 seconds
        setTimeout(() => {
            successModal.style.display = 'none';
        }, 3000);
    }, 1000);
});

// Close modal when clicking X or outside modal
closeModal.addEventListener('click', () => {
    successModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fetch GitHub repositories (bonus feature)
async function fetchGitHubRepos(username = 'your-github-username') {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        const githubProjectsContainer = document.getElementById('github-projects');
        
        // Filter out forked repos and get only original projects
        const originalRepos = repos.filter(repo => !repo.fork && repo.description);
        
        if (originalRepos.length === 0) {
            return;
        }
        
        // Create GitHub projects section title
        const githubTitle = document.createElement('div');
        githubTitle.className = 'github-section-title';
        githubTitle.innerHTML = '<h3>Latest GitHub Projects</h3>';
        githubProjectsContainer.appendChild(githubTitle);
        
        // Display repositories
        originalRepos.slice(0, 4).forEach((repo, index) => {
            const projectCard = createGitHubProjectCard(repo, index);
            githubProjectsContainer.appendChild(projectCard);
        });
        
    } catch (error) {
        console.log('GitHub API not accessible or username not found');
        // Fail silently - GitHub projects are optional
    }
}

// Create GitHub project card
function createGitHubProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card github-project';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    // Get primary language color
    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'PHP': '#4F5D95',
        'C++': '#f34b7d',
        'C': '#555555',
        'Ruby': '#701516',
        'Go': '#00ADD8'
    };
    
    const languageColor = languageColors[repo.language] || '#6c757d';
    
    card.innerHTML = `
        <div class="project-image">
            <div class="github-project-header" style="background: linear-gradient(135deg, ${languageColor}, ${languageColor}cc);">
                <i class="fab fa-github"></i>
                <span class="github-repo-name">${repo.name}</span>
            </div>
            <div class="project-overlay">
                <div class="project-links">
                    ${repo.homepage ? `<a href="${repo.homepage}" class="project-link" target="_blank" aria-label="View Live Site">
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : ''}
                    <a href="${repo.html_url}" class="project-link" target="_blank" aria-label="View Code">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p class="project-description">
                ${repo.description || 'A GitHub repository showcasing development skills and coding practices.'}
            </p>
            <div class="project-tech">
                ${repo.language ? `<span class="tech-tag" style="background-color: ${languageColor};">${repo.language}</span>` : ''}
                <span class="tech-tag github-stars">
                    <i class="fas fa-star"></i> ${repo.stargazers_count}
                </span>
                <span class="tech-tag github-forks">
                    <i class="fas fa-code-branch"></i> ${repo.forks_count}
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// Scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

fetchGitHubRepos('sarmientobengjii');

console.log('Portfolio website loaded successfully! 🚀');
console.log('Remember to:');
console.log('1. Replace placeholder content with your actual information');
console.log('2. Add your real profile picture');
console.log('3. Update project details and images');
console.log('4. Add your social media links');
console.log('5. Uncomment and update the GitHub username for dynamic repo loading');