<script lang="ts">
    import {
        balance,
        openPositions,
        screenerData,
        connectionStatus,
    } from "$lib/stores";
    import Icon from "@iconify/svelte";

    $: topScreener = $screenerData.slice(0, 5);
    $: active = $openPositions > 0;
</script>

<div class="dashboard">
    <header class="dashboard-header">
        <div class="header-title">
            <h1>Dashboard</h1>
            <p class="subtitle">
                Overview of market activity and account status
            </p>
        </div>
        <div
            class="status-badge"
            class:live={$connectionStatus === "connected"}
        >
            <div class="pulse-dot"></div>
            <span
                >{$connectionStatus === "connected"
                    ? "LIVE DATA"
                    : "OFFLINE"}</span
            >
        </div>
    </header>

    <div class="overview-grid">
        <div class="card stat-card">
            <div class="stat-icon-wrapper wallet">
                <Icon icon="mdi:wallet" width="28" />
            </div>
            <div class="stat-content">
                <span class="stat-label">Total Balance</span>
                <span class="stat-value font-mono">${$balance.toFixed(2)}</span>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-icon-wrapper chart">
                <Icon icon="mdi:chart-line" width="28" />
            </div>
            <div class="stat-content">
                <span class="stat-label">Open Positions</span>
                <span class="stat-value font-mono">{$openPositions}</span>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-icon-wrapper activity">
                <Icon icon="mdi:lightning-bolt" width="28" />
            </div>
            <div class="stat-content">
                <span class="stat-label">System Status</span>
                <span class="stat-value"
                    >{active ? "Trading Active" : "Scanning"}</span
                >
            </div>
        </div>
    </div>

    <div class="content-cols">
        <div class="col-main">
            <div class="card full-height">
                <div class="card-header-row">
                    <h3>
                        <Icon
                            icon="mdi:magnify"
                            width="20"
                            style="display: inline-block; vertical-align: middle; margin-right: 0.5rem;"
                        /> Top Opportunities
                    </h3>
                    <a href="/screener" class="btn btn-secondary btn-sm"
                        >View Scanner</a
                    >
                </div>

                <div class="opportunities-list">
                    {#if topScreener.length === 0}
                        <div class="empty-state">
                            <span class="loading-pulse"
                                >Scanning markets...</span
                            >
                        </div>
                    {:else}
                        {#each topScreener as coin}
                            <div class="opportunity-row">
                                <div class="coin-info">
                                    <span class="coin-symbol"
                                        >{coin.symbol}</span
                                    >
                                    <span class="coin-price font-mono"
                                        >${coin.price.toFixed(4)}</span
                                    >
                                </div>
                                <div class="coin-metrics">
                                    <span
                                        class="coin-change font-mono"
                                        class:text-success={coin.change_24h > 0}
                                        class:text-danger={coin.change_24h < 0}
                                    >
                                        {coin.change_24h > 0
                                            ? "+"
                                            : ""}{coin.change_24h.toFixed(2)}%
                                    </span>
                                    <div class="trend-bar">
                                        <div
                                            class="trend-fill"
                                            style="width: {Math.abs(
                                                coin.trend_score,
                                            )}%; background: {coin.trend_score >
                                            0
                                                ? 'var(--status-success)'
                                                : 'var(--status-danger)'}"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>

        <div class="col-side">
            <div class="card full-height">
                <div class="card-header-row">
                    <h3>System Log</h3>
                </div>
                <div class="system-log">
                    <div class="log-item">
                        <span class="log-time font-mono">12:00:01</span>
                        <span class="log-msg">Scanning 50 pairs...</span>
                    </div>
                    <div class="log-item">
                        <span class="log-time font-mono">12:00:05</span>
                        <span class="log-msg">Updated market data</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .dashboard {
        padding: 2rem;
        max-width: 1600px;
        margin: 0 auto;
        animation: fade-in 0.5s ease;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
    }

    .header-title h1 {
        font-size: 1.875rem;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.02em;
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 0.95rem;
    }

    .status-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: var(--text-muted);
    }

    .status-badge.live {
        color: var(--status-success);
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.2);
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: currentColor;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem;
    }

    .stat-icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .stat-icon-wrapper.wallet {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
    }

    .stat-icon-wrapper.chart {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        box-shadow: 0 8px 16px -4px rgba(139, 92, 246, 0.4);
    }

    .stat-icon-wrapper.activity {
        background: linear-gradient(135deg, #10b981, #059669);
        box-shadow: 0 8px 16px -4px rgba(16, 185, 129, 0.4);
    }

    .stat-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .stat-label {
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--text-primary);
    }

    .content-cols {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
    }

    .full-height {
        height: 100%;
        min-height: 400px;
        display: flex;
        flex-direction: column;
    }

    .card-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .card-header-row h3 {
        margin: 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
    }

    .opportunities-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .opportunity-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--bg-surface-hover);
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        transition: all 0.2s;
    }

    .opportunity-row:hover {
        border-color: var(--border-color);
        transform: translateX(4px);
    }

    .coin-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .coin-symbol {
        font-weight: 700;
        color: var(--text-primary);
    }

    .coin-price {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .coin-metrics {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        min-width: 150px;
        justify-content: flex-end;
    }

    .coin-change {
        font-weight: 600;
        font-size: 0.9rem;
    }

    .text-success {
        color: var(--status-success);
    }
    .text-danger {
        color: var(--status-danger);
    }

    .trend-bar {
        width: 60px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .trend-fill {
        height: 100%;
        border-radius: 2px;
    }

    .system-log {
        font-size: 0.85rem;
        color: var(--text-secondary);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .log-item {
        display: flex;
        gap: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .log-time {
        color: var(--text-muted);
    }

    .loading-pulse {
        animation: pulse 1s infinite alternate;
        color: var(--text-muted);
    }

    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
    }

    @media (max-width: 1024px) {
        .content-cols {
            grid-template-columns: 1fr;
        }
    }
</style>
