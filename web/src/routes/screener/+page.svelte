<script lang="ts">
    import { screenerData, connectionStatus } from "$lib/stores";

    let currentPage = 1;
    let itemsPerPage = 10;

    $: totalPages = Math.ceil($screenerData.length / itemsPerPage);
    $: paginatedData = $screenerData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    function nextPage() {
        if (currentPage < totalPages) currentPage++;
    }

    function prevPage() {
        if (currentPage > 1) currentPage--;
    }
</script>

<div class="screener-page">
    <div class="page-header">
        <h1>🔍 Market Screener</h1>
        <p>
            Top 10 pairs shown (Total: {$screenerData.length})
            <span
                class="connection-badge {$connectionStatus === 'connected'
                    ? 'live'
                    : ''}"
            >
                {#if $connectionStatus === "connected"}
                    • 🟢 Real-time WebSocket
                {:else if $connectionStatus === "connecting"}
                    • 🟡 Connecting...
                {:else}
                    • 🔴 Reconnecting...
                {/if}
            </span>
        </p>
        <div class="live-badge">
            <div class="pulse-dot"></div>
            LIVE
        </div>
    </div>

    {#if $connectionStatus === "connecting" && $screenerData.length === 0}
        <div class="loading">Loading screener data...</div>
    {:else if $connectionStatus === "error"}
        <div class="error">Connection error. Please check backend.</div>
    {:else}
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>24h Change</th>
                        <th>Volume</th>
                        <th>Trend Score</th>
                        <th>Volatility</th>
                    </tr>
                </thead>
                <tbody>
                    {#if paginatedData.length === 0}
                        <tr>
                            <td colspan="6" class="empty">Scanning market...</td
                            >
                        </tr>
                    {:else}
                        {#each paginatedData as coin (coin.symbol)}
                            <tr
                                class:positive={coin.change_24h > 0}
                                class:negative={coin.change_24h < 0}
                            >
                                <td class="symbol">{coin.symbol}</td>
                                <td class="price">${coin.price.toFixed(4)}</td>
                                <td class="change"
                                    >{coin.change_24h > 0
                                        ? "+"
                                        : ""}{coin.change_24h.toFixed(2)}%</td
                                >
                                <td
                                    >{(coin.volume_24h / 1000000).toFixed(
                                        2,
                                    )}M</td
                                >
                                <td class="trend">
                                    <div
                                        class="trend-badge"
                                        class:strong-buy={coin.trend_score >=
                                            80}
                                        class:buy={coin.trend_score >= 50 &&
                                            coin.trend_score < 80}
                                        class:neutral={coin.trend_score > -50 &&
                                            coin.trend_score < 50}
                                        class:sell={coin.trend_score <= -50 &&
                                            coin.trend_score > -80}
                                        class:strong-sell={coin.trend_score <=
                                            -80}
                                        class:zero-score={coin.trend_score ===
                                            0}
                                    >
                                        {coin.trend_score
                                            ? coin.trend_score.toFixed(0)
                                            : "-"}
                                    </div>
                                </td>
                                <td class="score">{coin.score.toFixed(2)}</td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>

        <div class="pagination-controls">
            <button
                on:click={prevPage}
                disabled={currentPage === 1}
                class="page-btn">Previous</button
            >
            <span class="page-info"
                >Page {currentPage} of {totalPages || 1}</span
            >
            <button
                on:click={nextPage}
                disabled={currentPage === totalPages}
                class="page-btn">Next</button
            >
        </div>
    {/if}
</div>

<style>
    .screener-page {
        padding: 2rem;
        height: 100%;
        overflow-y: auto;
    }

    .page-header {
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .page-header h1 {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #10b981, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        flex: 1;
    }

    .page-header p {
        flex-basis: 100%;
        color: #9ca3af;
        margin-top: -0.5rem;
        font-size: 0.875rem;
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

    .loading,
    .error {
        text-align: center;
        padding: 3rem;
        color: #9ca3af;
        font-size: 1.125rem;
    }

    .error {
        color: #ef4444;
    }

    .table-container {
        background: #1e1e1e;
        border-radius: 12px;
        overflow: hidden;
    }

    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        table-layout: fixed;
    }

    thead {
        background: #2b2b2b;
    }

    th {
        text-align: left;
        padding: 0.75rem;
        color: #9ca3af;
        font-weight: 600;
        font-size: 0.875rem;
        border-bottom: 2px solid #333;
    }

    tr {
        border-bottom: 1px solid #2b2b2b;
        transition: all 0.2s ease;
    }

    tr:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    td {
        padding: 0.75rem;
        font-size: 0.875rem;
    }

    .symbol {
        font-weight: 600;
        color: #06b6d4;
    }

    .price {
        font-family: "Courier New", monospace;
        font-weight: 600;
    }

    .change {
        font-weight: 600;
    }

    tr.positive .change {
        color: #10b981;
    }

    tr.negative .change {
        color: #ef4444;
    }

    .score {
        color: #fbbf24;
        font-weight: 600;
    }

    .empty {
        text-align: center;
        color: #6b7280;
        padding: 2rem;
        font-style: italic;
    }

    .trend {
        text-align: center;
    }

    .trend-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .trend-badge.strong-buy {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid #34d399;
        box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
    }

    .trend-badge.buy {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.5);
    }

    .trend-badge.neutral {
        background: rgba(107, 114, 128, 0.1);
        color: #9ca3af;
        border: 1px solid rgba(107, 114, 128, 0.5);
    }

    .trend-badge.sell {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.5);
    }

    .trend-badge.strong-sell {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        border: 1px solid #f87171;
        box-shadow: 0 0 10px rgba(248, 113, 113, 0.4);
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
