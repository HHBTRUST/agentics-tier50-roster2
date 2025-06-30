const API_CONFIG = {
    alpaca: {
        key: "PK1SMA5HLMLSSGGD1J2F",
        secret: "JedoGXjUB5RgdT3MooxO2y6EcRcda4",
        baseUrl: "https://paper-api.alpaca.markets"
    },
    alphaVantage: {
        key: "HKPZNZMZFDRL8T8G"
    }
};

class AgenticsAPI {
    async callAlpacaAPI(endpoint) {
        const response = await fetch(`${API_CONFIG.alpaca.baseUrl}${endpoint}`, {
            headers: {
                "APCA-API-KEY-ID": API_CONFIG.alpaca.key,
                "APCA-API-SECRET-KEY": API_CONFIG.alpaca.secret
            }
        });
        return response.json();
    }
    
    async testConnections() {
        try {
            await this.callAlpacaAPI("/v2/account");
            return true;
        } catch (error) {
            return false;
        }
    }
}
