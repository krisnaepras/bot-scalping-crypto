<script lang="ts">
    export let balance: number = 0;
    export let openPositions: number = 0;
    export let active: boolean = false;
</script>

<div class="panel">
    <h2>System Status</h2>
    <div class="grid">
        <div class="item">
            <span class="label">Status</span>
            <span class="value" class:active={active}>{active ? 'Running' : 'Stopped'}</span>
        </div>
        <div class="item">
            <span class="label">Balance</span>
            <span class="value">${balance.toFixed(2)}</span>
        </div>
        <div class="item">
            <span class="label">Positions</span>
            <span class="value">{openPositions}</span>
        </div>
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
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-top: 1rem;
    }
    .item {
        display: flex;
        flex-direction: column;
    }
    .label {
        font-size: 0.8rem;
        color: #aaa;
    }
    .value {
        font-size: 1.2rem;
        font-weight: bold;
    }
    .value.active {
        color: #00ff00;
    }
</style>
