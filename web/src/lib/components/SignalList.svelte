<script lang="ts">
    export let signals: string[] = [];
</script>

<div class="panel">
    <h2>Recent Signals</h2>
    <div class="list">
        {#each signals as signal}
            <div class="signal-item" class:long={signal.includes('Long')} class:short={signal.includes('Short')}>
                <span class="time">{new Date().toLocaleTimeString()}</span>
                <span class="type">{signal}</span>
            </div>
        {/each}
        {#if signals.length === 0}
            <div class="empty">No signals yet...</div>
        {/if}
    </div>
</div>

<style>
    .panel {
        background: #1e1e1e;
        color: #fff;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    h2 {
        margin-top: 0;
        border-bottom: 1px solid #333;
        padding-bottom: 0.5rem;
        color: #00ffcc;
    }
    .list {
        max-height: 200px;
        overflow-y: auto;
    }
    .signal-item {
        padding: 0.5rem;
        border-bottom: 1px solid #333;
        display: flex;
        justify-content: space-between;
    }
    .long { color: #00ff00; }
    .short { color: #ff0055; }
    .time { color: #888; font-size: 0.8em; }
    .empty { padding: 1rem; color: #666; text-align: center; }
</style>
