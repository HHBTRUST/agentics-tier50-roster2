// Agentics Search & Filter System v1.0.0

const AgenticsSearch = {
    agents: [],
    filteredAgents: [],
    
    init() {
        this.loadAgents();
        this.setupSearch();
        this.setupFilters();
        this.setupKeyboardShortcuts();
    },

    loadAgents() {
        // Get all agents from DOM
        document.querySelectorAll('.ag-agent').forEach(agent => {
            this.agents.push({
                id: agent.dataset.agentId,
                name: agent.querySelector('.ag-agent-name').textContent,
                role: agent.querySelector('.ag-agent-role').textContent,
                department: agent.dataset.department,
                element: agent
            });
        });
        this.filteredAgents = [...this.agents];
    },

    setupSearch() {
        const searchHtml = `
            <div class="search-container" style="
                position: sticky;
                top: 20px;
                z-index: 100;
                max-width: 600px;
                margin: 0 auto 40px;
                padding: 0 20px;
            ">
                <div class="search-box" style="
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.05);
                    border: 2px solid var(--ag-cyan);
                    border-radius: 30px;
                    padding: 15px 25px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 0 30px rgba(0,255,255,0.3);
                ">
                    <span style="font-size: 1.5em; margin-right: 15px;">🔍</span>
                    <input type="text" id="agentSearch" placeholder="Search agents by name, role, or department..." style="
                        flex: 1;
                        background: none;
                        border: none;
                        outline: none;
                        color: white;
                        font-size: 1.1em;
                    ">
                    <span id="searchCount" style="
                        margin-left: 15px;
                        color: var(--ag-cyan);
                        font-weight: bold;
                    ">51 agents</span>
                </div>
                
                <div class="filter-chips" style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 15px;
                    justify-content: center;
                ">
                    <button class="filter-chip active" data-filter="all" style="
                        padding: 6px 16px;
                        background: var(--ag-cyan);
                        border: none;
                        border-radius: 20px;
                        color: black;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">All Departments</button>
                </div>
            </div>
        `;

        // Insert search after header
        const header = document.querySelector('.ag-header');
        header.insertAdjacentHTML('afterend', searchHtml);

        // Add department filters
        const departments = [...new Set(this.agents.map(a => a.department))];
        const filterContainer = document.querySelector('.filter-chips');
        
        departments.forEach(dept => {
            const chip = document.createElement('button');
            chip.className = 'filter-chip';
            chip.dataset.filter = dept;
            chip.textContent = this.formatDepartmentName(dept);
            chip.style.cssText = `
                padding: 6px 16px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 20px;
                color: white;
                cursor: pointer;
                transition: all 0.3s;
            `;
            filterContainer.appendChild(chip);
        });

        // Search input handler
        document.getElementById('agentSearch').addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
    },

    setupFilters() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-chip')) {
                // Update active state
                document.querySelectorAll('.filter-chip').forEach(chip => {
                    chip.classList.remove('active');
                    chip.style.background = 'rgba(255,255,255,0.1)';
                    chip.style.color = 'white';
                });
                
                e.target.classList.add('active');
                e.target.style.background = 'var(--ag-cyan)';
                e.target.style.color = 'black';

                // Apply filter
                const filter = e.target.dataset.filter;
                this.filterByDepartment(filter);
            }
        });
    },

    performSearch(query) {
        query = query.toLowerCase();
        
        this.filteredAgents = this.agents.filter(agent => {
            return agent.name.toLowerCase().includes(query) ||
                   agent.role.toLowerCase().includes(query) ||
                   agent.department.toLowerCase().includes(query);
        });

        this.updateDisplay();
    },

    filterByDepartment(department) {
        if (department === 'all') {
            this.filteredAgents = [...this.agents];
        } else {
            this.filteredAgents = this.agents.filter(a => a.department === department);
        }
        
        // Keep search query if exists
        const searchQuery = document.getElementById('agentSearch').value;
        if (searchQuery) {
            this.performSearch(searchQuery);
        } else {
            this.updateDisplay();
        }
    },

    updateDisplay() {
        // Hide all agents
        this.agents.forEach(agent => {
            agent.element.style.display = 'none';
            agent.element.parentElement.style.display = 'none';
        });

        // Show filtered agents
        this.filteredAgents.forEach(agent => {
            agent.element.style.display = 'block';
            agent.element.parentElement.style.display = 'block';
        });

        // Update count
        document.getElementById('searchCount').textContent = 
            `${this.filteredAgents.length} agent${this.filteredAgents.length !== 1 ? 's' : ''}`;

        // Show/hide empty departments
        document.querySelectorAll('.ag-department').forEach(dept => {
            const visibleAgents = dept.querySelectorAll('.ag-agent[style*="display: block"]');
            dept.style.display = visibleAgents.length > 0 ? 'block' : 'none';
        });
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K to focus search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('agentSearch').focus();
            }
            
            // Escape to clear search
            if (e.key === 'Escape') {
                document.getElementById('agentSearch').value = '';
                this.performSearch('');
            }
        });
    },

    formatDepartmentName(dept) {
        const names = {
            'core-command': 'Core Command',
            'cognitive': 'Cognitive',
            'finance': 'Finance',
            'governance': 'Governance',
            'academy': 'Academy',
            'design': 'Design',
            'security': 'Security',
            'interface': 'Interface',
            'civilization': 'Civilization',
            'legacy': 'Legacy',
            'broadcast': 'Broadcast'
        };
        return names[dept] || dept;
    }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AgenticsSearch.init());
} else {
    AgenticsSearch.init();
}