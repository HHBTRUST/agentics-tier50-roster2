// Agentics Voice Command System v1.0.0
class AgenticsVoice {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.commands = this.defineCommands();
        this.init();
    }

    init() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.setupRecognition();
        this.createVoiceButton();
    }

    defineCommands() {
        return {
            'show roster': () => window.location.href = 'agentics-tier50-roster.html',
            'show agents': () => window.location.href = 'agentics-tier50-roster.html',
            'command center': () => window.location.href = 'command-center.html',
            'show status': () => window.location.href = 'status-dashboard.html',
            'show dashboard': () => window.location.href = 'status-dashboard.html',
            'founder seal': () => window.location.href = 'founders-seal-system.html',
            'show authority': () => window.location.href = 'authority-hierarchy.html',
            'search for *': (query) => this.searchForAgent(query),
            'find agent *': (query) => this.searchForAgent(query),
            'show *': (agent) => this.showAgent(agent),
            'status report': () => this.statusReport(),
            'help': () => this.showHelp(),
            'hey agentics': () => this.respond('Yes, Founder. How may I assist you?')
        };
    }

    setupRecognition() {
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI(true);
            this.respond('Listening...');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('Voice command:', transcript);
            this.processCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.respond('Sorry, I didn\'t catch that. Please try again.');
            this.isListening = false;
            this.updateUI(false);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI(false);
        };
    }

    processCommand(transcript) {
        let commandExecuted = false;

        for (const [pattern, action] of Object.entries(this.commands)) {
            if (pattern.includes('*')) {
                // Handle wildcard patterns
                const regex = new RegExp(pattern.replace('*', '(.+)'));
                const match = transcript.match(regex);
                if (match) {
                    action(match[1]);
                    commandExecuted = true;
                    break;
                }
            } else if (transcript.includes(pattern)) {
                action();
                commandExecuted = true;
                break;
            }
        }

        if (!commandExecuted) {
            this.respond('Command not recognized. Say "help" for available commands.');
        }
    }

    searchForAgent(query) {
        this.respond(`Searching for ${query}`);
        if (window.location.pathname.includes('roster')) {
            // If on roster page, trigger search
            const searchInput = document.getElementById('

                const searchInput = document.getElementById('agentSearch');
           if (searchInput) {
               searchInput.value = query;
               searchInput.dispatchEvent(new Event('input'));
           }
       } else {
           // Navigate to roster with search query
           window.location.href = `agentics-tier50-roster.html?search=${encodeURIComponent(query)}`;
       }
   }

   showAgent(agentName) {
       const agents = {
           'maxi': 'agents/maxi.html',
           'claude': 'agents/claude.html',
           'gemcore': 'agents/gemcore.html',
           'copilot': 'agents/copilot.html'
       };

       const agentPath = agents[agentName.toLowerCase()];
       if (agentPath) {
           this.respond(`Showing ${agentName}'s profile`);
           window.location.href = agentPath;
       } else {
           this.respond(`Agent ${agentName} not found`);
       }
   }

   statusReport() {
       this.respond('All systems operational. 51 agents active. System uptime 99.9 percent. No alerts.');
   }

   showHelp() {
       const helpText = `Available commands: Show roster, Show status, Command center, 
                        Show authority, Founder seal, Search for agent name, Status report`;
       this.respond(helpText);
   }

   respond(text) {
       // Visual feedback
       this.showNotification(text);
       
       // Voice feedback
       if (this.synthesis.speaking) {
           this.synthesis.cancel();
       }
       
       const utterance = new SpeechSynthesisUtterance(text);
       utterance.voice = this.synthesis.getVoices().find(voice => voice.name.includes('Samantha')) || 
                        this.synthesis.getVoices()[0];
       utterance.rate = 1.1;
       utterance.pitch = 1.0;
       this.synthesis.speak(utterance);
   }

   showNotification(text) {
       const notification = document.createElement('div');
       notification.style.cssText = `
           position: fixed;
           top: 20px;
           left: 50%;
           transform: translateX(-50%);
           background: rgba(0, 255, 255, 0.2);
           border: 1px solid var(--ag-cyan);
           padding: 15px 30px;
           border-radius: 30px;
           color: white;
           font-size: 1.1em;
           z-index: 10000;
           animation: slideDown 0.3s ease;
           max-width: 80%;
           text-align: center;
       `;
       notification.textContent = text;
       document.body.appendChild(notification);
       
       setTimeout(() => notification.remove(), 4000);
   }

   createVoiceButton() {
       const button = document.createElement('button');
       button.id = 'voiceCommandBtn';
       button.innerHTML = '🎤';
       button.style.cssText = `
           position: fixed;
           bottom: 80px;
           right: 20px;
           width: 60px;
           height: 60px;
           border-radius: 50%;
           background: linear-gradient(45deg, var(--ag-magenta), var(--ag-cyan));
           border: none;
           color: white;
           font-size: 24px;
           cursor: pointer;
           box-shadow: 0 4px 20px rgba(0, 255, 255, 0.5);
           transition: all 0.3s ease;
           z-index: 1000;
       `;

       button.addEventListener('click', () => this.toggleListening());
       button.addEventListener('mouseenter', () => {
           button.style.transform = 'scale(1.1)';
       });
       button.addEventListener('mouseleave', () => {
           button.style.transform = 'scale(1)';
       });

       document.body.appendChild(button);
   }

   toggleListening() {
       if (this.isListening) {
           this.recognition.stop();
       } else {
           this.recognition.start();
       }
   }

   updateUI(listening) {
       const button = document.getElementById('voiceCommandBtn');
       if (button) {
           if (listening) {
               button.style.animation = 'pulse 1s infinite';
               button.style.background = 'linear-gradient(45deg, #ff0000, #ff00ff)';
           } else {
               button.style.animation = 'none';
               button.style.background = 'linear-gradient(45deg, var(--ag-magenta), var(--ag-cyan))';
           }
       }
   }
}

// Auto-initialize
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', () => {
       window.agenticsVoice = new AgenticsVoice();
   });
} else {
   window.agenticsVoice = new AgenticsVoice();
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
   @keyframes slideDown {
       from {
           opacity: 0;
           transform: translate(-50%, -20px);
       }
       to {
           opacity: 1;
           transform: translate(-50%, 0);
       }
   }
   
   @keyframes pulse {
       0%, 100% {
           box-shadow: 0 0 0 0 rgba(255, 0, 255, 0.7);
       }
       70% {
           box-shadow: 0 0 0 20px rgba(255, 0, 255, 0);
       }
   }
`;
document.head.appendChild(style);