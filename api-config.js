// API Configuration for Agentics System
const API_CONFIG = {
    alpaca: {
        key: 'PK1SMA5HLMLSSGGD1J2F',
        secret: 'JedoGXjUB5RgdT3MooxO2y6EcRcda4',
        baseUrl: 'https://paper-api.alpaca.markets'
    },
    alphaVantage: {
        key: 'HKPZNZMZFDRL8T8G',
        baseUrl: 'https://www.alphavantage.co/query'
    }
};

class AgenticsAPI {
    constructor() {
        this.lastApiCall = 0;
    }

    async callAlpacaAPI(endpoint, method = 'GET', body = null) {
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
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Alpaca API Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Alpaca API call failed:', error);
            throw error;
        }
    }

    async callAlphaVantageAPI(params) {
        const urlParams = new URLSearchParams({
            ...params,
            apikey: API_CONFIG.alphaVantage.key
        });

        const url = `${API_CONFIG.alphaVantage.baseUrl}?${urlParams}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Alpha Vantage API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data['Error Message']) {
                throw new Error(`Alpha Vantage Error: ${data['Error Message']}`);
            }
            
            return data;
        } catch (error) {
            console.error('Alpha Vantage API call failed:', error);
            throw error;
        }
    }

    async testConnections() {
        try {
            console.log('Testing Alpaca API...');
            await this.callAlpacaAPI('/v2/account');
            console.log('✅ Alpaca connected');
            
            console.log('Testing Alpha Vantage API...');
            await this.callAlphaVantageAPI({
                function: 'GLOBAL_QUOTE',
                symbol: 'AAPL'
            });
            console.log('✅ Alpha Vantage connected');
            
            return true;
        } catch (error) {
            console.error('❌ API connection test failed:', error);
            return false;
        }
    }
}