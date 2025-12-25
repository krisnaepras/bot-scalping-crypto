<script lang="ts">
    import {
        balance,
        openPositions,
        screenerData,
        connectionStatus,
    } from "$lib/stores";

    // Subscribe to stores - data is instantly available!
    $: topScreener = $screenerData.slice(0, 5);
    $: active = $openPositions > 0;
</script>

<div class="dashboard">
    <header class="dashboard-header">
        <div class="title-section">
            <h1>📊 Dashboard</h1>
            <div
                class="live-badge {$connectionStatus === 'connected'
                    ? 'active'
                    : ''}"
            >
                <div class="pulse-dot"></div>
                {#if $connectionStatus === "connected"}
                    LIVE (WebSocket)
                {:else if $connectionStatus === "connecting"}
                    Connecting...
                {:else}
                    Reconnecting...
                {/if}
            </div>
        </div>
    </header>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
                <span class="stat-label">Balance</span>
                <span class="stat-value">${$balance.toFixed(2)}</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
                <span class="stat-label">Open Positions</span>
                <span class="stat-value">{$openPositions}</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">{active ? "🟢" : "🔴"}</div>
            <div class="stat-content">
                <span class="stat-label">Status</span>
                <span class="stat-value">{active ? "Active" : "Idle"}</span>
            </div>
        </div>
    </div>

    <div class="content-grid">
        <div class="panel guide">
            <h2>🚀 Quick Guide</h2>
            <ul>
                <li>
                    <strong>Screener:</strong> Monitor top volatile pairs with trend
                    scores
                </li>
                <li>
                    <strong>Positions:</strong> Track active trades with real-time
                    P&L
                </li>
                <li>
                    <strong>History:</strong> Review past trades and performance
                </li>
                <li>
                    <strong>Settings:</strong> Configure margin, leverage, and risk
                    management
                </li>
            </ul>
        </div>

        {#if topScreener.length > 0}
            <div class="panel preview">
                <h2>🎯 Top Opportunities</h2>
                <div class="opportunities-list">
                    {#each topScreener as coin}
                        <div class="opportunity-item">
                            <div class="coin-info">
                                <span class="coin-symbol">{coin.symbol}</span>
                                <span
                                    class="coin-change"
                                    class:positive={coin.change_24h > 0}
                                    class:negative={coin.change_24h < 0}
                                >
                                    {coin.change_24h > 0
                                        ? "+"
                                        : ""}{coin.change_24h.toFixed(2)}%
                                </span>
                            </div>
                            <div class="coin-metrics">
                                <span class="metric">
                                    Vol: ${(coin.volume / 1e6).toFixed(1)}M
                                </span>
                                <span
                                    class="trend-score"
                                    class:bullish={coin.trend_score > 0}
                                    class:bearish={coin.trend_score < 0}
                                >
                                    Score: {coin.trend_score?.toFixed(1) ||
                                        "N/A"}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
                <a href="/screener" class="view-all">View All →</a>
            </div>
        {/if}
    </div>
</div>

<style>
    .dashboard {
        padding: 2rem;
        height: 100%;
        overflow-y: auto;
    }

    .dashboard-header {
        margin-bottom: 2rem;
    }

    .title-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .title-section h1 {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #06b6d4, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .live-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #10b981;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .kpi-card {
        background: #1e1e1e;
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid #333;
        transition: all 0.3s ease;
    }

    .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .kpi-icon {
        font-size: 2.5rem;
    }

    .kpi-content {
        flex: 1;
    }

    .kpi-label {
        font-size: 0.875rem;
        color: #9ca3af;
        margin-bottom: 0.25rem;
    }

    .kpi-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #e5e7eb;
    }

    .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
    }

    .panel {
        background: #1e1e1e;
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #333;
    }

    .panel h2 {
        margin-bottom: 1rem;
        font-size: 1.25rem;
        color: #e5e7eb;
    }

    .guide ul {
        list-style: none;
        padding: 0;
    }

    .guide li {
        padding: 0.75rem 0;
        border-bottom: 1px solid #333;
        color: #9ca3af;
    }

    .guide li:last-child {
        border-bottom: none;
    }

    .guide strong {
        color: #06b6d4;
    }

    .opportunities-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .opportunity-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #2b2b2b;
        border-radius: 8px;
    }

    .coin-info {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .coin-symbol {
        font-weight: 600;
        color: #06b6d4;
    }

    .coin-change {
        font-size: 0.875rem;
        font-weight: 600;
    }

    .coin-change.positive {
        color: #10b981;
    }

    .coin-change.negative {
        color: #ef4444;
    }

    .trend-score {
        padding: 0.25rem 0.75rem;
        border-radius: 8px;
        background: #333;
        color: #9ca3af;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .trend-score.strong {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
    }

    .view-all {
        display: inline-block;
        color: #06b6d4;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .view-all:hover {
        text-decoration: underline;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }
        50% {
            opacity: 0.6;
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
        }
    }
</style>
