// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS library if it's loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Animate feature items with staggered delay
    animateFeatureItems();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check if user has a preferred theme stored
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.toggle('dark-theme', currentTheme === 'dark');
        updateThemeIcon(currentTheme === 'dark');
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const isDarkTheme = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        updateThemeIcon(isDarkTheme);
    });
    
    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Animated Git branching visualization
    animateBranchingVisualization();

    // Remote repository animation
    animateRemoteRepository();

    // Highlight active section in navigation
    window.addEventListener('scroll', highlightActiveSection);
});

// Function to animate the branching visualization
function animateBranchingVisualization() {
    const commitDots = document.querySelectorAll('.commit-dot');
    
    // Reset animations by removing and re-adding elements
    commitDots.forEach(dot => {
        const parent = dot.parentNode;
        const clone = dot.cloneNode(true);
        parent.removeChild(dot);
        setTimeout(() => {
            parent.appendChild(clone);
        }, 100);
    });
}

// Function to animate the remote repository visualization
function animateRemoteRepository() {
    const pushArrow = document.querySelector('.arrow.push');
    const pullArrow = document.querySelector('.arrow.pull');
    
    if (!pushArrow || !pullArrow) return;
    
    // Push animation
    setInterval(() => {
        pushArrow.classList.add('active');
        setTimeout(() => {
            pushArrow.classList.remove('active');
        }, 1000);
    }, 3000);
    
    // Pull animation (delayed)
    setInterval(() => {
        pullArrow.classList.add('active');
        setTimeout(() => {
            pullArrow.classList.remove('active');
        }, 1000);
    }, 3000);
}

// Function to highlight the active section in navigation
function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Terminal animation effects
function animateTerminals() {
    const terminals = document.querySelectorAll('.terminal-animation');
    
    terminals.forEach(terminal => {
        const responses = terminal.querySelectorAll('.response');
        
        responses.forEach((response, index) => {
            response.style.animationDelay = `${index * 0.5 + 0.5}s`;
        });
    });
}

// Call terminal animation when page loads
document.addEventListener('DOMContentLoaded', animateTerminals);

// Add interactive animations to workflow steps
document.addEventListener('DOMContentLoaded', function() {
    const workflowSteps = document.querySelectorAll('.workflow-step');
    
    workflowSteps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        step.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
});

// Add CSS class for active navigation link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add active class to nav link on click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Set initial active link based on current scroll position
    highlightActiveSection();
});

// Add animation to the Git branching visualization
document.addEventListener('DOMContentLoaded', function() {
    // Animate commit dots appearing one by one
    const commitDots = document.querySelectorAll('.commit-dot');
    
    commitDots.forEach((dot, index) => {
        dot.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Add merge animation
    const featureBranch = document.querySelector('.feature-branch-line');
    const mainBranch = document.querySelector('.main-branch-line');
    
    if (featureBranch && mainBranch) {
        setTimeout(() => {
            featureBranch.classList.add('merging');
        }, commitDots.length * 300 + 500);
    }
});

// Add animation to the push/pull arrows
document.addEventListener('DOMContentLoaded', function() {
    const arrows = document.querySelectorAll('.arrow');
    
    // Add animation class to arrows
    arrows.forEach(arrow => {
        arrow.classList.add('animated');
    });
    
    // Start animation cycle
    startArrowAnimationCycle();
});

// Function to animate arrows in a cycle
function startArrowAnimationCycle() {
    const pushArrow = document.querySelector('.arrow.push');
    const pullArrow = document.querySelector('.arrow.pull');
    
    if (!pushArrow || !pullArrow) return;
    
    // Animation cycle
    function animationCycle() {
        // Push animation
        setTimeout(() => {
            pushArrow.classList.add('active');
            setTimeout(() => {
                pushArrow.classList.remove('active');
            }, 1500);
        }, 0);
        
        // Pull animation (after push)
        setTimeout(() => {
            pullArrow.classList.add('active');
            setTimeout(() => {
                pullArrow.classList.remove('active');
            }, 1500);
        }, 2000);
    }
    
    // Start initial animation
    animationCycle();
    
    // Repeat animation every 5 seconds
    setInterval(animationCycle, 5000);
}

// Add CSS for active navigation link
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active::after {
            width: 100%;
        }
        .nav-link.active {
            color: var(--primary-color);
        }
        .workflow-step.active .step-number {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(240, 80, 51, 0.5);
        }
        .arrow.active .arrow-line {
            background-color: var(--primary-color);
        }
        .arrow.active .arrow-head {
            border-color: var(--primary-color);
        }
        .arrow.animated {
            transition: all 0.3s ease;
        }
        .feature-branch-line.merging {
            transform: rotate(0deg);
            top: 150px;
            transition: all 1s ease;
        }
    `;
    document.head.appendChild(style);
});

// Function to animate feature items with staggered delay
function animateFeatureItems() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s ease';
        item.style.transitionDelay = `${index * 0.3}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100);
    });
    
    // Add hover effects to benefit cards
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.benefit-icon').style.transform = 'scale(1.2)';
            this.querySelector('.benefit-icon').style.color = 'var(--secondary-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.benefit-icon').style.transform = 'scale(1)';
            this.querySelector('.benefit-icon').style.color = 'var(--primary-color)';
        });
    });
}
