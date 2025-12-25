<script lang="ts">
    import { onMount } from "svelte";
    import { balance, connectionStatus } from "$lib/stores";

    let trades: any[] = [];
    let loading = true;
    let error = "";

    // Stats calculation
    let stats = {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalPnL: 0,
        avgWin: 0,
        avgLoss: 0,
    };

    // Re-fetch history when balance changes (signal of activity/updates from backend)
    $: if ($balance) {
        fetchHistory();
    }

    onMount(() => {
        fetchHistory();
    });

    async function fetchHistory() {
        try {
            const response = await fetch(
                "http://localhost:8080/api/trades/history",
            );
            const data = await response.json();

            if (data.trades) {
                trades = data.trades;
                calculateStats();
            }

            loading = false;
            error = "";
        } catch (e) {
            error = "Failed to fetch trade history";
            console.error(e);
        }
    }

    async function resetHistory() {
        if (
            !confirm(
                "Are you sure you want to clear all trade history? This cannot be undone.",
            )
        )
            return;

        try {
            const response = await fetch(
                "http://localhost:8080/api/trades/reset",
                {
                    method: "POST",
                },
            );
            const data = await response.json();

            if (data.status === "success") {
                trades = [];
                stats = {
                    totalTrades: 0,
                    wins: 0,
                    losses: 0,
                    winRate: 0,
                    totalPnL: 0,
                    avgWin: 0,
                    avgLoss: 0,
                };
                alert("History reset successfully.");
            } else {
                alert("Failed to reset history: " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error connecting to backend");
        }
    }

    function calculateStats() {
        const closedTrades = trades.filter((t) => t.status === "CLOSED");
        stats.totalTrades = closedTrades.length;
        stats.wins = closedTrades.filter((t) => t.pnl > 0).length;
        stats.losses = closedTrades.filter((t) => t.pnl < 0).length;
        stats.winRate =
            stats.totalTrades > 0 ? (stats.wins / stats.totalTrades) * 100 : 0;
        stats.totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

        const wins = closedTrades.filter((t) => t.pnl > 0);
        const losses = closedTrades.filter((t) => t.pnl < 0);
        stats.avgWin =
            wins.length > 0
                ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length
                : 0;
        stats.avgLoss =
            losses.length > 0
                ? losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length
                : 0;
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function calculateDuration(entryTime: string, exitTime: string): string {
        const entry = new Date(entryTime).getTime();
        const exit = new Date(exitTime).getTime();
        const diff = exit - entry;

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (minutes > 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}h ${mins}m`;
        }
        return `${minutes}m ${seconds}s`;
    }
</script>

<div class="history-page">
    <div class="page-header">
        <h1>📜 Trade History</h1>
        <div class="header-actions">
            <p>
                Complete trading history with detailed analytics
                <span
                    class="connection-badge {$connectionStatus === 'connected'
                        ? 'live'
                        : ''}"
                >
                    {#if $connectionStatus === "connected"}
                        • 🟢 Live WebSocket
                    {:else if $connectionStatus === "connecting"}
                        • 🟡 Connecting...
                    {:else}
                        • 🔴 Reconnecting...
                    {/if}
                </span>
            </p>
            <button
                class="reset-btn"
                on:click={resetHistory}
                disabled={loading || trades.length === 0}
            >
                🗑️ Reset History
            </button>
        </div>
    </div>

    <div class="stats-cards">
        <div class="stat-card">
            <div class="stat-label">Total Trades</div>
            <div class="stat-value">{stats.totalTrades}</div>
        </div>
        <div class="stat-card win">
            <div class="stat-label">Wins</div>
            <div class="stat-value">{stats.wins}</div>
        </div>
        <div class="stat-card loss">
            <div class="stat-label">Losses</div>
            <div class="stat-value">{stats.losses}</div>
        </div>
        <div
            class="stat-card"
            class:profit={stats.winRate >= 50}
            class:loss={stats.winRate < 50}
        >
            <div class="stat-label">Win Rate</div>
            <div class="stat-value">{stats.winRate.toFixed(1)}%</div>
        </div>
        <div
            class="stat-card"
            class:profit={stats.totalPnL > 0}
            class:loss={stats.totalPnL < 0}
        >
            <div class="stat-label">Total P&L</div>
            <div class="stat-value">
                {stats.totalPnL > 0 ? "+" : ""}{stats.totalPnL.toFixed(2)} USDT
            </div>
        </div>
    </div>

    {#if loading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading trade history...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>{error}</h3>
        </div>
    {:else if trades.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📜</div>
            <h3>No Trade History</h3>
            <p>Trades will appear here after closing positions</p>
        </div>
    {:else}
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Side</th>
                        <th>Entry</th>
                        <th>Exit</th>
                        <th>Size</th>
                        <th>Leverage</th>
                        <th>Duration</th>
                        <th>P&L</th>
                        <th>Exit Time</th>
                    </tr>
                </thead>
                <tbody>
                    {#each trades as trade}
                        <tr
                            class:win={trade.pnl && trade.pnl > 0}
                            class:loss={trade.pnl && trade.pnl < 0}
                        >
                            <td class="symbol">{trade.symbol}</td>
                            <td>
                                <span
                                    class="side-badge"
                                    class:long={trade.side === "LONG"}
                                    class:short={trade.side === "SHORT"}
                                >
                                    {trade.side}
                                </span>
                            </td>
                            <td class="price"
                                >${trade.entry_price.toFixed(4)}</td
                            >
                            <td class="price">
                                {#if trade.exit_price}
                                    ${trade.exit_price.toFixed(4)}
                                {:else}
                                    -
                                {/if}
                            </td>
                            <td
                                >${(trade.quantity * trade.entry_price).toFixed(
                                    2,
                                )}</td
                            >
                            <td>{trade.leverage}x</td>
                            <td class="duration">
                                {#if trade.exit_time}
                                    {calculateDuration(
                                        trade.entry_time,
                                        trade.exit_time,
                                    )}
                                {:else}
                                    Active
                                {/if}
                            </td>
                            <td
                                class="pnl"
                                class:profit={trade.pnl > 0}
                                class:loss={trade.pnl < 0}
                            >
                                {#if trade.pnl}
                                    {trade.pnl > 0
                                        ? "+"
                                        : ""}{trade.pnl.toFixed(2)} USDT
                                {:else}
                                    -
                                {/if}
                            </td>
                            <td class="timestamp">
                                {#if trade.exit_time}
                                    {formatDate(trade.exit_time)}
                                {:else}
                                    -
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .history-page {
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
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
    }

    .page-header p {
        color: #9ca3af;
        font-size: 0.875rem;
    }

    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
    }

    .reset-btn {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.5);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .reset-btn:hover:not(:disabled) {
        background: rgba(239, 68, 68, 0.2);
        transform: translateY(-1px);
    }

    .reset-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: #1e1e1e;
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid #333;
    }

    .stat-card.win {
        border-color: rgba(16, 185, 129, 0.3);
    }

    .stat-card.loss {
        border-color: rgba(239, 68, 68, 0.3);
    }

    .stat-card.profit {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.5);
    }

    .stat-card .stat-label {
        font-size: 0.875rem;
        color: #9ca3af;
        margin-bottom: 0.5rem;
    }

    .stat-card .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #e5e7eb;
    }

    .stat-card.win .stat-value {
        color: #10b981;
    }

    .stat-card.loss .stat-value {
        color: #ef4444;
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
        border-top: 3px solid #f59e0b;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    .empty-icon,
    .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .table-container {
        background: #1e1e1e;
        border-radius: 12px;
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        background: #2b2b2b;
    }

    th {
        text-align: left;
        padding: 0.875rem;
        color: #9ca3af;
        font-weight: 600;
        font-size: 0.875rem;
        border-bottom: 2px solid #333;
    }

    tr {
        border-bottom: 1px solid #2b2b2b;
        transition: background 0.2s ease;
    }

    tr:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    tr.win {
        background: rgba(16, 185, 129, 0.05);
    }

    tr.loss {
        background: rgba(239, 68, 68, 0.05);
    }

    td {
        padding: 0.875rem;
        font-size: 0.875rem;
        color: #e5e7eb;
    }

    .symbol {
        font-weight: 600;
        color: #06b6d4;
    }

    .side-badge {
        display: inline-block;
        padding: 0.25rem 0.625rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .side-badge.long {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.5);
    }

    .side-badge.short {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.5);
    }

    .price {
        font-family: "Courier New", monospace;
        font-weight: 500;
    }

    .duration {
        color: #9ca3af;
        font-size: 0.8125rem;
    }

    .pnl {
        font-weight: 700;
        font-family: "Courier New", monospace;
    }

    .pnl.profit {
        color: #10b981;
    }

    .pnl.loss {
        color: #ef4444;
    }

    .timestamp {
        color: #9ca3af;
        font-size: 0.8125rem;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
