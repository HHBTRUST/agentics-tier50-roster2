// API Configuration for Agentics System
// File: api-config.js

const API_CONFIG = {
    alpaca: {
        key: 'PK1SMA5HLMLSSGGD1J2F',
        secret: 'JedoGXjUB5RgdT3MooxO2y6EcRcda4EK7Uu9I4Ag',
        baseUrl: 'https://paper-api.alpaca.markets'
    },
    alphaVantage: {
        key: 'HKPZNZMZFDRL8T8G',
        baseUrl: 'https://www.alphavantage.co/query'
    },
    // Rate limiting settings
    rateLimits: {
        alpaca: 200, // requests per minute
        alphaVantage: 5 // requests per minute (free tier)
    }
};

class AgenticsAPI {
    constructor() {
        this.lastApiCall = 0;
        this.callHistory = {
            alpaca: [],
            alphaVantage: []
        };
    }

    // Rate limiting helper
    async enforceRateLimit(service, limit) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Clean old calls
        this.callHistory[service] = this.callHistory[service].filter(
            timestamp => timestamp > oneMinuteAgo
        );
        
        // Check if we're at the limit
        if (this.callHistory[service].length >= limit) {
            const oldestCall = Math.min(...this.callHistory[service]);
            const waitTime = 60000 - (now - oldestCall);
            
            if (waitTime > 0) {
                console.log(`Rate limit reached for ${service}. Waiting ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        
        // Record this call
        this.callHistory[service].push(now);
    }

    async callAlpacaAPI(endpoint, method = 'GET', body = null) {
        await this.enforceRateLimit('alpaca', API_CONFIG.rateLimits.alpaca);
        
        const url = `${API_CONFIG.alpaca.baseUrl}${endpoint}`;
        
        const options = {
            method: method,
            headers: {
                'APCA-API-KEY-ID': API_CONFIG.alpaca.key,
                'APCA-API-SECRET-KEY': API_CONFIG.alpaca.secret,
                'Content-Type': 'application/json'
            }
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        try {
            console.log(`📡 Calling Alpaca API: ${method} ${endpoint}`);
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Alpaca API Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Alpaca API success: ${endpoint}`);
            return data;
            
        } catch (error) {
            console.error('❌ Alpaca API call failed:', error);
            throw error;
        }
    }

    async callAlphaVantageAPI(params) {
        await this.enforceRateLimit('alphaVantage', API_CONFIG.rateLimits.alphaVantage);
        
        const urlParams = new URLSearchParams({
            ...params,
            apikey: API_CONFIG.alphaVantage.key
        });

        const url = `${API_CONFIG.alphaVantage.baseUrl}?${urlParams}`;

        try {
            console.log(`📡 Calling Alpha Vantage API: ${params.function} for ${params.symbol || 'market data'}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Alpha Vantage API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check for API-specific errors
            if (data['Error Message']) {
                throw new Error(`Alpha Vantage Error: ${data['Error Message']}`);
            }
            
            if (data['Note']) {
                throw new Error(`Alpha Vantage Rate Limit: ${data['Note']}`);
            }
            
            console.log(`✅ Alpha Vantage API success: ${params.function}`);
            return data;
            
        } catch (error) {
            console.error('❌ Alpha Vantage API call failed:', error);
            throw error;
        }
    }

    async testConnections() {
        try {
            console.log('🧪 Testing API connections...');
            
            // Test Alpaca API
            console.log('Testing Alpaca API...');
            const account = await this.callAlpacaAPI('/v2/account');
            console.log(`✅ Alpaca connected - Account: ${account.account_number}`);
            
            // Test Alpha Vantage API
            console.log('Testing Alpha Vantage API...');
            const quote = await this.callAlphaVantageAPI({
                function: 'GLOBAL_QUOTE',
                symbol: 'AAPL'
            });
            
            if (quote['Global Quote']) {
                console.log(`✅ Alpha Vantage connected - AAPL: $${quote['Global Quote']['05. price']}`);
            }
            
            console.log('🎉 All API connections successful!');
            return true;
            
        } catch (error) {
            console.error('❌ API connection test failed:', error);
            return false;
        }
    }

    // Utility method to get API status
    getAPIStatus() {
        return {
            alpaca: {
                configured: !!(API_CONFIG.alpaca.key && API_CONFIG.alpaca.secret),
                baseUrl: API_CONFIG.alpaca.baseUrl,
                recentCalls: this.callHistory.alpaca.length
            },
            alphaVantage: {
                configured: !!API_CONFIG.alphaVantage.key,
                baseUrl: API_CONFIG.alphaVantage.baseUrl,
                recentCalls: this.callHistory.alphaVantage.length
            }
        };
    }

    // Method to safely log configuration (without secrets)
    logConfiguration() {
        console.log('🔧 API Configuration:');
        console.log('- Alpaca Trading API: Configured ✅');
        console.log('- Alpha Vantage Data: Configured ✅');
        console.log('- Rate Limits: Alpaca 200/min, Alpha Vantage 5/min');
    }
}

// Initialize global API instance
const agenticsAPI = new AgenticsAPI();

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.agenticsAPI = agenticsAPI;
    window.API_CONFIG = API_CONFIG;
}

// Log successful initialization
console.log('🚀 Agentics API Configuration Loaded');
agenticsAPI.logConfiguration();