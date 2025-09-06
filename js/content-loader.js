// SPA Content Loader
class PortfolioApp {
    constructor() {
        this.projects = ['project-1', 'project-2', 'project-3'];
        this.currentProject = null;
        this.init();
    }

    async init() {
        await this.loadHomeContent();
        this.setupProjectCards();
        this.handleURLParams();
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleURLParams();
        });
    }

    async loadMarkdown(file) {
        try {
            const response = await fetch(`content/${file}.md`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const markdown = await response.text();
            return marked.parse(markdown);
        } catch (error) {
            console.error(`Error loading ${file}.md:`, error);
            return `<p>Error loading content for ${file}</p>`;
        }
    }

    async loadHomeContent() {
        const homeContent = await this.loadMarkdown('home');
        const contentDiv = document.getElementById('home-content');
        if (contentDiv) {
            contentDiv.innerHTML = homeContent;
        }
    }

    async loadProjectContent(projectName) {
        const projectContent = await this.loadMarkdown(`projects/${projectName}`);
        const contentDiv = document.getElementById('project-content');
        if (contentDiv) {
            contentDiv.innerHTML = projectContent;
        }

        // Update project meta info based on project
        this.updateProjectMeta(projectName);
    }

    updateProjectMeta(projectName) {
        const projectInfo = this.getProjectInfo(projectName);
        
        document.getElementById('project-title').textContent = projectInfo.title;
        document.getElementById('project-subtitle').textContent = projectInfo.subtitle;
        
        const metaDiv = document.getElementById('project-meta');
        metaDiv.innerHTML = `
            <div class="meta-item">
                <h4>Role</h4>
                <p>${projectInfo.role}</p>
            </div>
            <div class="meta-item">
                <h4>Duration</h4>
                <p>${projectInfo.duration}</p>
            </div>
            <div class="meta-item">
                <h4>Team</h4>
                <p>${projectInfo.team}</p>
            </div>
            <div class="meta-item">
                <h4>Year</h4>
                <p>${projectInfo.year}</p>
            </div>
        `;

        // Update navigation
        this.updateNavigation(projectName);
    }

    getProjectInfo(projectName) {
        const projects = {
            'project-1': {
                title: 'Mobile App Redesign',
                subtitle: 'Transforming user experience through thoughtful design',
                role: 'Product Designer',
                duration: '3 months',
                team: '2 Designers, 3 Engineers',
                year: '2024'
            },
            'project-2': {
                title: 'SaaS Dashboard',
                subtitle: 'Streamlining complex data visualization',
                role: 'Lead Designer',
                duration: '4 months',
                team: '1 Designer, 4 Engineers',
                year: '2024'
            },
            'project-3': {
                title: 'Design System',
                subtitle: 'Building scalable design foundations',
                role: 'Design Systems Lead',
                duration: '6 months',
                team: '3 Designers, 2 Engineers',
                year: '2023'
            }
        };
        return projects[projectName] || projects['project-1'];
    }

    updateNavigation(currentProject) {
        const currentIndex = this.projects.indexOf(currentProject);
        const prevProject = currentIndex > 0 ? this.projects[currentIndex - 1] : null;
        const nextProject = currentIndex < this.projects.length - 1 ? this.projects[currentIndex + 1] : null;

        const prevLink = document.getElementById('prev-project');
        const nextLink = document.getElementById('next-project');

        if (prevProject) {
            prevLink.onclick = () => this.showProject(prevProject);
            prevLink.classList.remove('hidden');
        } else {
            prevLink.classList.add('hidden');
        }

        if (nextProject) {
            nextLink.onclick = () => this.showProject(nextProject);
            nextLink.classList.remove('hidden');
        } else {
            nextLink.classList.add('hidden');
        }
    }

    setupProjectCards() {
        setTimeout(() => {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-4px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        }, 100);
    }

    showHome() {
        document.body.className = 'home-view';
        this.currentProject = null;
        this.updateURL();
        document.title = 'Jihyun Kim – Product Designer';
    }

    async showProject(projectName) {
        document.body.className = 'project-view';
        this.currentProject = projectName;
        await this.loadProjectContent(projectName);
        this.updateURL();
        
        const projectInfo = this.getProjectInfo(projectName);
        document.title = `${projectInfo.title} – Jihyun Kim`;
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    updateURL() {
        const url = this.currentProject ? `?project=${this.currentProject}` : '';
        history.pushState(null, '', url);
    }

    handleURLParams() {
        const params = new URLSearchParams(window.location.search);
        const project = params.get('project');
        
        if (project && this.projects.includes(project)) {
            this.showProject(project);
        } else {
            this.showHome();
        }
    }
}

// Global functions for onclick handlers
let app;

function showHome() {
    app.showHome();
}

function showProject(projectName) {
    app.showProject(projectName);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app = new PortfolioApp();
});