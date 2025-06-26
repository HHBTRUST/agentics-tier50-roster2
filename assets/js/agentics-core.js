// Agentics Core JavaScript v1.0.0
// Shared functionality across all pages

const AgenticsCore = {
    // Initialize
    init() {
        this.setupParticles();
        this.setupAnimations();
        this.setupNavigation();
        console.log('Agentics Core Initialized');
    },

    // Particle System
    setupParticles() {
        const particleContainer = document.querySelector('.ag-particles');
        if (!particleContainer) return;

        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'ag-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 255, 255, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${15 + Math.random() * 10}s linear infinite;
            `;
            particleContainer.appendChild(particle);
        }
    },

    // Smooth Animations
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-in').forEach(el => {
            observer.observe(el);
        });
    },

    // Navigation Enhancements
    setupNavigation() {
        // Add active state to current page
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    },

    // Utility Functions
    utils: {
        // Format numbers with commas
        formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        // Copy to clipboard
        copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Copied to clipboard!');
            });
        },

        // Show notification
        showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                background: ${type === 'success' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'};
                border: 1px solid ${type === 'success' ? '#0f0' : '#f00'};
                border-radius: 8px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    },

    // Agent Data
    agents: {
        total: 51,
        departments: 10,
        coreCommand: ['maxi', 'claude', 'gemcore', 'copilot'],
        
        // Get agent by ID
        getAgent(id) {
            // This would connect to your agent database
            return {
                id: id,
                name: id.charAt(0).toUpperCase() + id.slice(1),
                department: 'core-command',
                status: 'active'
            };
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AgenticsCore.init());
} else {
    AgenticsCore.init();
}

// Export for use in other scripts
window.AgenticsCore = AgenticsCore;