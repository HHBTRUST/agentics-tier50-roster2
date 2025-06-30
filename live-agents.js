const agenticsAPI = new AgenticsAPI();

class YieldaAgent {
    async getLivePrice(symbol) {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.alphaVantage.key}`);
        const data = await response.json();
        return data["Global Quote"];
    }
}

const yielda = new YieldaAgent();
if (typeof window !== "undefined") {
    window.yielda = yielda;
    window.agenticsAPI = agenticsAPI;
}
