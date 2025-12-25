<script lang="ts">
    import { onMount } from 'svelte';

    let winRate = 0;
    let totalPnl = 0;
    let totalTrades = 0;
    let loading = true;

    onMount(async () => {
        try {
            // Since analytics endpoint is temporarily disabled, show placeholder
            // const response = await fetch('http://localhost:8080/api/analytics/performance');
            // const data = await response.json();
            // winRate = data.win_rate || 0;
            // totalPnl = data.total_pnl || 0;
            
            // Placeholder data
            winRate = 0;
            totalPnl = 0;
            totalTrades = 0;
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            loading = false;
        }
    });
</script>

<div class="analytics-page">
    <div class="page-header">
        <h1>📊 Analytics</h1>
        <p>Performance metrics and statistics</p>
    </div>

    <div class="analytics-container">
        {#if loading}
            <div class="loading">Loading analytics...</div>
        {:else}
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-label">Total P&L</div>
                    <div class="stat-value" class:positive={totalPnl > 0} class:negative={totalPnl < 0}>
                        {totalPnl > 0 ? '+' : ''}{totalPnl.toFixed(2)} USDT
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-label">Win Rate</div>
                    <div class="stat-value">{winRate.toFixed(1)}%</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-label">Total Trades</div>
                    <div class="stat-value">{totalTrades}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-label">Avg Trade</div>
                    <div class="stat-value">
                        {totalTrades > 0 ? (totalPnl / totalTrades).toFixed(2) : '0.00'} USDT
                    </div>
                </div>
            </div>

            <div class="info-box">
                <h3>📊 Analytics Coming Soon</h3>
                <ul>
                    <li>Equity curve visualization</li>
                    <li>Win/Loss distribution charts</li>
                    <li>Drawdown analysis</li>
                    <li>Daily/Weekly/Monthly breakdowns</li>
                    <li>Symbol performance comparison</li>
                </ul>
                <p class="note">These features will be available once trade data accumulates.</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .analytics-page {
        padding: 2rem;
        height: 100%;
        overflow-y: auto;
    }

    .page-header {
        margin-bottom: 2rem;
    }

    .page-header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #06b6d4, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .page-header p {
        color: #9ca3af;
    }

    .analytics-container {
        max-width: 1200px;
    }

    .loading {
        text-align: center;
        padding: 3rem;
        color: #64748b;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.6));
        border-radius: 16px;
        border: 1px solid #334155;
        padding: 2rem;
        text-align: center;
        transition: all 0.2s;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        border-color: #475569;
    }

    .stat-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .stat-label {
        font-size: 0.875rem;
        color: #94a3b8;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #e2e8f0;
    }

    .stat-value.positive {
        color: #10b981;
    }

    .stat-value.negative {
        color: #ef4444;
    }

    .info-box {
        background: rgba(30, 41, 59, 0.4);
        border: 1px solid #334155;
        border-radius: 16px;
        padding: 2rem;
    }

    .info-box h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #60a5fa;
    }

    .info-box ul {
        list-style: none;
        padding: 0;
        margin-bottom: 1.5rem;
    }

    .info-box li {
        padding: 0.75rem 0;
        color: #cbd5e1;
        border-bottom: 1px solid rgba(51, 65, 85, 0.3);
    }

    .info-box li::before {
        content: "✓";
        margin-right: 0.75rem;
        color: #10b981;
        font-weight: 700;
    }

    .note {
        color: #64748b;
        font-size: 0.875rem;
        font-style: italic;
        margin-top: 1rem;
    }
</style>
