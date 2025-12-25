<script lang="ts">
    export let opportunities: any[] = [];
    let sortedOpportunities: any[] = [];
    let sortField = "score";
    let sortDirection = "desc";

    $: {
        sortedOpportunities = [...opportunities].sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            // Volatility is change_24h, but we want absolute if field is 'score'
            // Actually 'score' is already absolute volatility.
            // If sorting by change, use raw value.

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }

    function sort(field: string) {
        if (sortField === field) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortField = field;
            sortDirection = "desc"; // Default desc for numbers usually
        }
    }
</script>

<div class="screener-panel">
    <h2>🚀 Micin Screener (Top Volatility)</h2>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th on:click={() => sort("symbol")}
                        >Symbol {sortField === "symbol"
                            ? sortDirection === "asc"
                                ? "▲"
                                : "▼"
                            : ""}</th
                    >
                    <th on:click={() => sort("price")}
                        >Price {sortField === "price"
                            ? sortDirection === "asc"
                                ? "▲"
                                : "▼"
                            : ""}</th
                    >
                    <th on:click={() => sort("change_24h")}
                        >24h Change {sortField === "change_24h"
                            ? sortDirection === "asc"
                                ? "▲"
                                : "▼"
                            : ""}</th
                    >
                    <th on:click={() => sort("volume_24h")}
                        >Vol (24h) {sortField === "volume_24h"
                            ? sortDirection === "asc"
                                ? "▲"
                                : "▼"
                            : ""}</th
                    >
                    <th on:click={() => sort("trend_score")}
                        >Trend Score {sortField === "trend_score"
                            ? sortDirection === "asc"
                                ? "▲"
                                : "▼"
                            : ""}</th
                    >
                    <th on:click={() => sort("score")}
                        >Score {sortField === "score"
                            ? sortDirection === "asc"
                                ? "▲"
                                : "▼"
                            : ""}</th
                    >
                </tr>
            </thead>
            <tbody>
                {#if sortedOpportunities.length === 0}
                    <tr>
                        <td colspan="6" class="empty">Scanning market...</td>
                    </tr>
                {:else}
                    {#each sortedOpportunities as coin (coin.symbol)}
                        <tr
                            class:positive={coin.change_24h > 0}
                            class:negative={coin.change_24h < 0}
                            class:price-changed={coin.priceChanged}
                            class:price-up={coin.priceUp}
                        >
                            <td class="symbol">{coin.symbol}</td>
                            <td class="price">${coin.price.toFixed(4)}</td>
                            <td class="change"
                                >{coin.change_24h > 0
                                    ? "+"
                                    : ""}{coin.change_24h.toFixed(2)}%</td
                            >
                            <td>{(coin.volume_24h / 1000000).toFixed(2)}M</td>

                            <!-- Trend Score Column -->
                            <td class="trend">
                                <div
                                    class="trend-badge"
                                    class:strong-buy={coin.trend_score >= 80}
                                    class:buy={coin.trend_score >= 50 &&
                                        coin.trend_score < 80}
                                    class:neutral={coin.trend_score > -50 &&
                                        coin.trend_score < 50}
                                    class:sell={coin.trend_score <= -50 &&
                                        coin.trend_score > -80}
                                    class:strong-sell={coin.trend_score <= -80}
                                >
                                    {coin.trend_score
                                        ? coin.trend_score.toFixed(0)
                                        : "0"}
                                </div>
                            </td>

                            <td class="score">{coin.score.toFixed(2)}</td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    .screener-panel {
        background: #1e1e1e;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        grid-column: span 2; /* Take up more space */
    }

    h2 {
        margin-top: 0;
        color: #ffa500;
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    th {
        text-align: left;
        padding: 0.5rem;
        color: #888;
        border-bottom: 1px solid #333;
        cursor: pointer;
        user-select: none;
    }
    th:hover {
        color: #fff;
    }

    td {
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid #2a2a2a;
    }

    .symbol {
        font-weight: bold;
        color: #e0e0e0;
    }

    .positive td:nth-child(3) {
        color: #00ffcc;
    }
    .negative td:nth-child(3) {
        color: #ff3366;
    }

    .score {
        font-weight: 700;
        color: #f59e0b; /* Amber 500 */
    }

    .trend-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-weight: 700;
        font-size: 0.875rem;
        min-width: 40px;
        text-align: center;
    }

    .trend-badge.strong-buy {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399; /* Bright Green */
        border: 1px solid #34d399;
        box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
    }

    .trend-badge.buy {
        color: #10b981; /* Green */
    }

    .trend-badge.neutral {
        color: #94a3b8; /* Grey */
    }

    .trend-badge.sell {
        color: #ef4444; /* Red */
    }

    .trend-badge.strong-sell {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171; /* Bright Red */
        border: 1px solid #f87171;
        box-shadow: 0 0 10px rgba(248, 113, 113, 0.4);
    }

    .empty {
        text-align: center;
        color: #666;
        padding: 2rem;
        font-style: italic;
    }
</style>
