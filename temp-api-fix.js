// Simple API Test Functions
async function testAPI() {
    const results = document.getElementById("api-results");
    if (!results) {
        alert("Results div not found");
        return;
    }
    
    results.innerHTML = "🔄 Testing...";
    
    try {
        // Simple test without complex dependencies
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=HKPZNZMZFDRL8T8G`);
        const data = await response.json();
        
        if (data['Global Quote']) {
            results.innerHTML = "✅ API Working - AAPL: $" + data['Global Quote']['05. price'];
        } else {
            results.innerHTML = "❌ API Response Error";
        }
    } catch (error) {
        results.innerHTML = "❌ Error: " + error.message;
    }
}

async function testPrice() {
    testAPI(); // Use the same function for simplicity
}

async function testAccount() {
    const results = document.getElementById("api-results");
    results.innerHTML = "🔄 Testing Alpaca...";
    
    try {
        const response = await fetch('https://paper-api.alpaca.markets/v2/account', {
            headers: {
                'APCA-API-KEY-ID': 'PK1SMA5HLMLSSGGD1J2F',
                'APCA-API-SECRET-KEY': 'JedoGXjUB5RgdT3MooxO2y6EcRcda4'
            }
        });
        
        if (response.ok) {
            const account = await response.json();
            results.innerHTML = "✅ Account Connected - Portfolio: $" + parseFloat(account.portfolio_value).toFixed(2);
        } else {
            results.innerHTML = "❌ Account connection failed";
        }
    } catch (error) {
        results.innerHTML = "❌ Error: " + error.message;
    }
}
