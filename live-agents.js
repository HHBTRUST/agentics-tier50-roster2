// Live Agent Functions with Real API Integration
// File: live-agents.js

// Initialize API client
const agenticsAPI = new AgenticsAPI();

// YIELDA AGENT - Real Stock & Dividend Intelligence
class YieldaAgent {
    constructor() {
        this.name = 'Yielda';
        this.specialty = 'Dividend Intelligence';
    }

    // Get real-time stock quote
    async getLivePrice(symbol) {
        try {
            console.log(`[${this.name}] Fetching live price for ${symbol}...`);
            
            const quote = await agenticsAPI.callAlphaVantageAPI({
                function: 'GLOBAL_QUOTE',
                symbol: symbol
            });

            const globalQuote = quote['Global Quote'];
            
            if (!globalQuote) {
                throw new Error('No quote data available');
            }

            const result = {
                symbol: globalQuote['01. symbol'],
                price: parseFloat(globalQuote['05. price']),
                change: parseFloat(globalQuote['09. change']),
                changePercent: globalQuote['10. change percent'],
                volume: parseInt(globalQuote['06. volume']),
                lastTradingDay: globalQuote['07. latest trading day'],
                timestamp: new Date().toISOString()
            };

            console.log(`[${this.name}] ✅ Price fetched for ${symbol}: $${result.price}`);
            return result;

        } catch (error) {
            console.error(`[${this.name}] ❌ Error fetching price:`, error);
            throw error;
        }
    }

    // Get comprehensive dividend analysis
    async getDividendAnalysis(symbol) {
        try {
            console.log(`[${this.name}] Analyzing dividend data for ${symbol}...`);
            
            const overview = await agenticsAPI.callAlphaVantageAPI({
                function: 'OVERVIEW',
                symbol: symbol
            });

            if (!overview.Symbol) {
                throw new Error('Company overview not available');
            }

            const result = {
                symbol: overview.Symbol,
                name: overview.Name,
                dividendYield: overview.DividendYield || 'N/A',
                dividendPerShare: overview.DividendPerShare || 'N/A',
                exDividendDate: overview.ExDividendDate || 'N/A',
                payoutRatio: overview.PayoutRatio || 'N/A',
                sector: overview.Sector,
                industry: overview.Industry,
                marketCap: overview.MarketCapitalization,
                peRatio: overview.PERatio,
                analysis: this.generateDividendAnalysis(overview),
                timestamp: new Date().toISOString()
            };

            console.log(`[${this.name}] ✅ Dividend analysis complete for ${symbol}`);
            return result;

        } catch (error) {
            console.error(`[${this.name}] ❌ Error analyzing dividends:`, error);
            throw error;
        }
    }

    // Generate dividend analysis insights
    generateDividendAnalysis(overview) {
        const yield = parseFloat(overview.DividendYield) || 0;
        const payout = parseFloat(overview.PayoutRatio) || 0;
        
        let analysis = [];
        
        if (yield > 6) {
            analysis.push('🔥 High yield - verify sustainability');
        } else if (yield > 3) {
            analysis.push('✅ Solid dividend yield');
        } else if (yield > 0) {
            analysis.push('📈 Moderate dividend yield');
        } else {
            analysis.push('❌ No dividend currently paid');
        }
        
        if (payout > 0) {
            if (payout > 80) {
                analysis.push('⚠️ High payout ratio - limited growth potential');
            } else if (payout > 60) {
                analysis.push('📊 Moderate payout ratio');
            } else {
                analysis.push('🚀 Conservative payout - room for growth');
            }
        }

        return analysis.join(' | ');
    }
}

// STACK AGENT - Real Options & Trading Intelligence
class StackAgent {
    constructor() {
        this.name = 'Stack';
        this.specialty = 'Trading Intelligence';
    }

    // Get account information
    async getAccountInfo() {
        try {
            console.log(`[${this.name}] Fetching account information...`);
            
            const account = await agenticsAPI.callAlpacaAPI('/v2/account');
            
            const result = {
                accountNumber: account.account_number,
                equity: parseFloat(account.equity),
                cash: parseFloat(account.cash),
                dayTradingBuyingPower: parseFloat(account.day_trading_buying_power),
                regularBuyingPower: parseFloat(account.buying_power),
                portfolioValue: parseFloat(account.portfolio_value),
                status: account.status,
                tradingBlocked: account.trading_blocked,
                transfersBlocked: account.transfers_blocked,
                timestamp: new Date().toISOString()
            };

            console.log(`[${this.name}] ✅ Account info retrieved. Portfolio value: $${result.portfolioValue}`);
            return result;

        } catch (error) {
            console.error(`[${this.name}] ❌ Error fetching account:`, error);
            throw error;
        }
    }

    // Get current positions
    async getPositions() {
        try {
            console.log(`[${this.name}] Fetching current positions...`);
            
            const positions = await agenticsAPI.callAlpacaAPI('/v2/positions');
            
            const result = positions.map(position => ({
                symbol: position.symbol,
                qty: parseInt(position.qty),
                side: position.side,
                marketValue: parseFloat(position.market_value),
                avgEntryPrice: parseFloat(position.avg_entry_price),
                unrealizedPL: parseFloat(position.unrealized_pl),
                unrealizedPLPercent: parseFloat(position.unrealized_plpc) * 100,
                currentPrice: parseFloat(position.current_price),
                lastdayPrice: parseFloat(position.lastday_price),
                changeToday: parseFloat(position.change_today)
            }));

            console.log(`[${this.name}] ✅ Found ${result.length} positions`);
            return result;

        } catch (error) {
            console.error(`[${this.name}] ❌ Error fetching positions:`, error);
            throw error;
        }
    }

    // Place a paper trade order
    async placeOrder(symbol, qty, side, orderType = 'market') {
        try {
            console.log(`[${this.name}] Placing ${side} order: ${qty} shares of ${symbol}`);
            
            const orderData = {
                symbol: symbol.toUpperCase(),
                qty: qty.toString(),
                side: side, // 'buy' or 'sell'
                type: orderType, // 'market', 'limit', 'stop', etc.
                time_in_force: 'day'
            };

            const order = await agenticsAPI.callAlpacaAPI('/v2/orders', 'POST', orderData);
            
            const result = {
                orderId: order.id,
                symbol: order.symbol,
                qty: parseInt(order.qty),
                side: order.side,
                type: order.type,
                status: order.status,
                submittedAt: order.submitted_at,
                timeInForce: order.time_in_force
            };

            console.log(`[${this.name}] ✅ Order placed. ID: ${result.orderId}`);
            return result;

        } catch (error) {
            console.error(`[${this.name}] ❌ Error placing order:`, error);
            throw error;
        }
    }
}

// ECHOVOICE AGENT - Voice Command Processing
class EchoVoiceAgent {
    constructor() {
        this.name = 'EchoVoice';
        this.specialty = 'Voice Intelligence';
        this.yielda = new YieldaAgent();
        this.stack = new StackAgent();
    }

    // Process voice commands
    async processCommand(command) {
        try {
            console.log(`[${this.name}] Processing command: "${command}"`);
            
            const lowerCommand = command.toLowerCase();
            
            // Route to appropriate agent
            if (lowerCommand.includes('price') || lowerCommand.includes('quote')) {
                return await this.handlePriceCommand(command);
            } else if (lowerCommand.includes('dividend') || lowerCommand.includes('yield')) {
                return await this.handleDividendCommand(command);
            } else if (lowerCommand.includes('account') || lowerCommand.includes('balance')) {
                return await this.handleAccountCommand(command);
            } else {
                return {
                    success: false,
                    message: 'Command not recognized. Try asking for prices, dividends, or account info.',
                    suggestions: [
                        'What is the price of Apple?',
                        'Show me dividend yield for Coca-Cola',
                        'What is my account balance?'
                    ]
                };
            }

        } catch (error) {
            console.error(`[${this.name}] ❌ Error processing command:`, error);
            return {
                success: false,
                message: `Error processing command: ${error.message}`
            };
        }
    }

    // Handle price-related commands
    async handlePriceCommand(command) {
        const symbol = this.extractSymbol(command);
        if (!symbol) {
            return { success: false, message: 'Please specify a stock symbol' };
        }

        const priceData = await this.yielda.getLivePrice(symbol);
        return {
            success: true,
            type: 'price',
            data: priceData,
            message: `${symbol} is trading at $${priceData.price} (${priceData.changePercent})`
        };
    }

    // Handle dividend-related commands
    async handleDividendCommand(command) {
        const symbol = this.extractSymbol(command);
        if (!symbol) {
            return { success: false, message: 'Please specify a stock symbol' };
        }

        const dividendData = await this.yielda.getDividendAnalysis(symbol);
        return {
            success: true,
            type: 'dividend',
            data: dividendData,
            message: `${symbol} has a dividend yield of ${dividendData.dividendYield}%`
        };
    }

    // Handle account commands
    async handleAccountCommand(command) {
        const account = await this.stack.getAccountInfo();
        return {
            success: true,
            type: 'account',
            data: account,
            message: `Account balance: $${account.cash.toFixed(2)}, Portfolio value: $${account.portfolioValue.toFixed(2)}`
        };
    }

    // Extract stock symbol from text
    extractSymbol(text) {
        // Look for stock symbols (1-5 uppercase letters)
        const symbolMatch = text.match(/\b[A-Z]{1,5}\b/);
        if (symbolMatch) return symbolMatch[0];

        // Look for company names and convert to symbols
        const companyMap = {
            'apple': 'AAPL',
            'microsoft': 'MSFT',
            'google': 'GOOGL',
            'amazon': 'AMZN',
            'tesla': 'TSLA',
            'meta': 'META',
            'nvidia': 'NVDA',
            'coca cola': 'KO',
            'disney': 'DIS',
            'netflix': 'NFLX'
        };

        const lowerText = text.toLowerCase();
        for (const [company, symbol] of Object.entries(companyMap)) {
            if (lowerText.includes(company)) {
                return symbol;
            }
        }

        return null;
    }
}

// Initialize global agents
const yielda = new YieldaAgent();
const stack = new StackAgent();
const echoVoice = new EchoVoiceAgent();

// Export agents for use in HTML
if (typeof window !== 'undefined') {
    window.yielda = yielda;
    window.stack = stack;
    window.echoVoice = echoVoice;
    window.agenticsAPI = agenticsAPI;
}