<script lang="ts">
    import { positions, connectionStatus } from "$lib/stores";

    function calculatePnL(position: any): { value: number; percent: number } {
        // Placeholder - will be updated with real-time prices later
        const pnl = 0;
        const percent = 0;
        return { value: pnl, percent };
    }

    function formatDuration(): string {
        return "5m 32s";
    }
</script>

<div class="positions-page">
    <div class="page-header">
        <h1>📊 Active Positions</h1>
        <p>
            Real-time WebSocket monitoring
            <span class="connection-status status-{$connectionStatus}">
                {#if $connectionStatus === "connected"}
                    🟢 Live
                {:else if $connectionStatus === "connecting"}
                    🟡 Connecting...
                {:else}
                    🔴 Disconnected
                {/if}
            </span>
        </p>
        <div class="stats-bar">
            <div class="stat-item">
                <span class="stat-label">Total Positions:</span>
                <span class="stat-value">{$positions.length}</span>
            </div>
        </div>
    </div>

    {#if $connectionStatus === "connecting"}
        <div class="loading">
            <div class="spinner"></div>
            <p>Connecting to WebSocket...</p>
        </div>
    {:else if $connectionStatus === "error"}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Connection error</h3>
            <p>Check if backend is running</p>
        </div>
    {:else if $positions.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📊</div>
            <h3>No Active Positions</h3>
            <p>Waiting for trading signals...</p>
        </div>
    {:else}
        <div class="positions-grid">
            {#each $positions as position (position.symbol)}
                {@const pnl = calculatePnL(position)}
                <div
                    class="position-card"
                    class:long={position.side === "Long"}
                    class:short={position.side === "Short"}
                >
                    <div class="card-header">
                        <div class="symbol-section">
                            <div class="symbol">{position.symbol}</div>
                            <div class="duration">{formatDuration()}</div>
                        </div>
                        <div
                            class="side-badge"
                            class:long={position.side === "Long"}
                            class:short={position.side === "Short"}
                        >
                            {position.side}
                        </div>
                    </div>

                    <div class="card-body">
                        <div class="price-section">
                            <div class="price-item">
                                <div class="price-label">Entry Price</div>
                                <div class="price-value">
                                    ${position.entry_price.toFixed(4)}
                                </div>
                            </div>
                            <div class="price-item">
                                <div class="price-label">Current Price</div>
                                <div class="price-value current">
                                    ${(position.entry_price * 1.001).toFixed(4)}
                                </div>
                            </div>
                        </div>

                        <div class="stats-grid">
                            <div class="stat">
                                <div class="stat-label">Size</div>
                                <div class="stat-value">
                                    ${position.size.toFixed(2)}
                                </div>
                            </div>

                            <div class="stat">
                                <div class="stat-label">Leverage</div>
                                <div class="stat-value">
                                    {position.leverage.toFixed(0)}x
                                </div>
                            </div>

                            <div class="stat">
                                <div class="stat-label">Margin</div>
                                <div class="stat-value">
                                    ${(
                                        position.size / position.leverage
                                    ).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div
                            class="pnl-section"
                            class:profit={pnl.value > 0}
                            class:loss={pnl.value < 0}
                        >
                            <div class="pnl-label">P&L</div>
                            <div class="pnl-value">
                                {pnl.value > 0 ? "+" : ""}{pnl.value.toFixed(2)}
                                USDT
                                <span class="pnl-percent"
                                    >({pnl.percent > 0
                                        ? "+"
                                        : ""}{pnl.percent.toFixed(2)}%)</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .positions-page {
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
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
    }

    .page-header p {
        color: #9ca3af;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }

    .stats-bar {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        background: #1e1e1e;
        border-radius: 8px;
    }

    .stat-item {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .stat-label {
        color: #9ca3af;
        font-size: 0.875rem;
    }

    .stat-value {
        color: #e5e7eb;
        font-weight: 600;
        font-size: 1.125rem;
    }

    .loading,
    .empty-state,
    .error-state {
        text-align: center;
        padding: 4rem 2rem;
        background: #1e1e1e;
        border-radius: 12px;
    }

    .spinner {
        border: 3px solid #333;
        border-top: 3px solid #10b981;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .empty-icon,
    .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .positions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
    }

    .position-card {
        background: #1e1e1e;
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #333;
        transition: all 0.3s ease;
    }

    .position-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    }

    .position-card.long {
        border-left: 4px solid #10b981;
    }

    .position-card.short {
        border-left: 4px solid #ef4444;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }

    .symbol-section {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .symbol {
        font-size: 1.5rem;
        font-weight: 700;
        color: #06b6d4;
    }

    .duration {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .side-badge {
        padding: 0.375rem 1rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .side-badge.long {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
        border: 1px solid #10b981;
    }

    .side-badge.short {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid #ef4444;
    }

    .price-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #333;
    }

    .price-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .price-label {
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .price-value {
        font-size: 1.125rem;
        font-weight: 600;
        font-family: "Courier New", monospace;
        color: #e5e7eb;
    }

    .price-value.current {
        color: #06b6d4;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .stat {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .stat .stat-label {
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .stat .stat-value {
        font-size: 1rem;
        font-weight: 600;
        color: #e5e7eb;
    }

    .pnl-section {
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .pnl-section.profit {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .pnl-section.loss {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .pnl-label {
        font-size: 0.875rem;
        color: #9ca3af;
        font-weight: 600;
    }

    .pnl-value {
        font-size: 1.25rem;
        font-weight: 700;
        font-family: "Courier New", monospace;
    }

    .pnl-section.profit .pnl-value {
        color: #10b981;
    }

    .pnl-section.loss .pnl-value {
        color: #ef4444;
    }

    .pnl-percent {
        font-size: 0.875rem;
        margin-left: 0.5rem;
    }
</style>
