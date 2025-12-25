<script lang="ts">
    export let slPercent: number = 1.0;
    export let trailingCallback: number = 0.5;

    async function saveSettings() {
        try {
             const res = await fetch('http://localhost:8080/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sl_percent: slPercent / 100,
                    trailing_callback: trailingCallback / 100
                })
            });
            if (res.ok) {
                alert('Settings Saved!');
            } else {
                alert('Failed to save settings');
            }
        } catch (e) {
            console.error(e);
            alert('Error saving settings');
        }
    }
</script>

<div class="panel">
    <h2>Simulation Settings</h2>
    <div class="form-group">
        <label>Stop Loss (%)</label>
        <input type="number" step="0.1" bind:value={slPercent} />
    </div>
    <div class="form-group">
        <label>Trailing Stop Callback (%)</label>
        <input type="number" step="0.05" bind:value={trailingCallback} />
    </div>
    <button on:click={saveSettings}>Save Settings</button>
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
    .form-group {
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #ccc;
    }
    input {
        width: 100%;
        padding: 0.5rem;
        background: #333;
        border: 1px solid #555;
        color: #fff;
        border-radius: 4px;
    }
    button {
        background: #00ffcc;
        color: #000;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }
    button:hover {
        background: #00ccaa;
    }
</style>
