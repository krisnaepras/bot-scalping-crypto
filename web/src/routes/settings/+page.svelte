<script lang="ts">
    import { onMount } from "svelte";

    let balance = 1000.0;
    let margin = 100.0;
    let leverage = 10;
    let slPercent = 2.0;
    let trailingCallback = 1.0;
    let autoRisk = false;
    let message = "";
    let loading = true;

    onMount(async () => {
        // Fetch current settings from backend
        try {
            const response = await fetch(
                "http://localhost:8080/api/settings/simulation",
            );
            if (response.ok) {
                const data = await response.json();
                balance = data.balance ?? 1000.0;
                margin = data.margin ?? 100.0;
                leverage = data.leverage ?? 10;
                // Convert raw (0.02) to percentage (2.0)
                slPercent = (data.sl_percent ?? 0.02) * 100;
                trailingCallback = (data.trailing_callback ?? 0.01) * 100;
                autoRisk = data.auto_risk ?? false;
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            loading = false;
        }
    });

    async function updateSettings() {
        try {
            const response = await fetch(
                "http://localhost:8080/api/settings/simulation",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        balance,
                        margin,
                        leverage,
                        // Convert percentage (2.0) to raw (0.02)
                        sl_percent: slPercent / 100,
                        trailing_callback: trailingCallback / 100,
                        auto_risk: autoRisk,
                    }),
                },
            );

            if (response.ok) {
                message = "✅ Settings updated successfully!";
                setTimeout(() => (message = ""), 3000);
            } else {
                message = "❌ Failed to update settings";
            }
        } catch (error) {
            message = "❌ Error: " + error;
        }
    }

    async function resetHistory() {
        if (!confirm("Are you sure you want to clear all trade history?"))
            return;

        try {
            const response = await fetch(
                "http://localhost:8080/api/trades/reset",
                {
                    method: "POST",
                },
            );
            if (response.ok) {
                message = "🗑️ Trade history cleared!";
                setTimeout(() => (message = ""), 3000);
            } else {
                message = "❌ Failed to reset history";
            }
        } catch (err) {
            message = "❌ Error: " + err;
        }
    }
</script>

<div class="settings-page">
    <div class="page-header">
        <h1>⚙️ Settings</h1>
        <p>Configure your trading simulation parameters</p>
    </div>

    <div class="settings-container">
        <div class="settings-section">
            <h2>💰 Account Settings</h2>
            <div class="settings-grid">
                <div class="setting-item">
                    <label for="balance">Initial Balance (USDT)</label>
                    <input
                        type="number"
                        id="balance"
                        bind:value={balance}
                        step="0.01"
                        min="10"
                    />
                    <span class="help-text"
                        >Starting balance for simulation</span
                    >
                </div>

                <div class="setting-item">
                    <label for="margin">Default Margin (USDT)</label>
                    <input
                        type="number"
                        id="margin"
                        bind:value={margin}
                        step="0.01"
                        min="0.1"
                    />
                    <span class="help-text"
                        >Margin per trade (e.g., 2.5, 10, 100)</span
                    >
                </div>

                <div class="setting-item">
                    <label for="leverage">Leverage</label>
                    <input
                        type="number"
                        id="leverage"
                        bind:value={leverage}
                        step="1"
                        min="1"
                        max="125"
                    />
                    <span class="help-text">Max 125x for Binance Futures</span>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header-row">
                <h2>📊 Risk Management</h2>
                <div class="toggle-wrapper">
                    <span class="toggle-label">Auto Risk (ATR)</span>
                    <label class="switch">
                        <input type="checkbox" bind:checked={autoRisk} />
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <div class="settings-grid" class:disabled={autoRisk}>
                <div class="setting-item">
                    <label for="sl">Stop Loss (%)</label>
                    <input
                        type="number"
                        id="sl"
                        bind:value={slPercent}
                        step="0.1"
                        min="0.1"
                        max="10"
                        disabled={autoRisk}
                    />
                    <span class="help-text">
                        {#if autoRisk}
                            Calculated automatically based on volatility (ATR)
                        {:else}
                            Stop loss percentage from entry
                        {/if}
                    </span>
                </div>

                <div class="setting-item">
                    <label for="trailing">Trailing Stop Callback (%)</label>
                    <input
                        type="number"
                        id="trailing"
                        bind:value={trailingCallback}
                        step="0.1"
                        min="0.1"
                        max="5"
                        disabled={autoRisk}
                    />
                    <span class="help-text">
                        {#if autoRisk}
                            Calculated automatically (1.5x ATR)
                        {:else}
                            Trailing stop activation distance
                        {/if}
                    </span>
                </div>
            </div>
        </div>

        <div class="actions">
            <button class="btn-primary" onclick={updateSettings}>
                💾 Save Settings
            </button>
            {#if message}
                <div class="message" class:success={message.includes("✅")}>
                    {message}
                </div>
            {/if}
        </div>

        <div class="settings-section danger-zone">
            <h2>🚨 Danger Zone</h2>
            <div class="setting-item">
                <div class="settings-header">
                    <label>Reset Trade History</label>
                </div>
                <div class="control">
                    <button class="btn-danger" onclick={resetHistory}>
                        🗑️ Clear All Trades
                    </button>
                    <div class="help-text">
                        This helps when restarting a simulation.
                    </div>
                </div>
            </div>
        </div>

        <div class="info-box">
            <h3>ℹ️ Important Notes</h3>
            <ul>
                <li>Changes will reset your current simulation</li>
                <li>Balance and margin are in USDT</li>
                <li>Higher leverage = higher risk</li>
                <li>Recommended: 10-20x leverage for scalping</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .settings-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .page-header {
        margin-bottom: 2rem;
    }

    .page-header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #60a5fa, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .page-header p {
        color: #9ca3af;
        font-size: 1rem;
    }

    .settings-container {
        background: rgba(30, 41, 59, 0.5);
        border-radius: 16px;
        border: 1px solid #334155;
        padding: 2rem;
    }

    .settings-section {
        margin-bottom: 2rem;
    }

    .settings-section h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #e2e8f0;
    }

    .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .setting-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .setting-item label {
        font-weight: 500;
        color: #cbd5e1;
        font-size: 0.875rem;
    }

    .setting-item input {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid #475569;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        color: #e2e8f0;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .setting-item input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .help-text {
        font-size: 0.75rem;
        color: #64748b;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #334155;
    }

    .btn-primary {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border: none;
        border-radius: 8px;
        padding: 0.875rem 2rem;
        color: white;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    }

    .message {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
    }

    .message.success {
        background: rgba(34, 197, 94, 0.1);
        border-color: rgba(34, 197, 94, 0.3);
        color: #86efac;
    }

    .info-box {
        margin-top: 2rem;
        padding: 1.5rem;
        background: rgba(59, 130, 246, 0.05);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 12px;
    }

    .info-box h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #60a5fa;
    }

    .info-box ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .info-box li {
        padding: 0.5rem 0;
        color: #94a3b8;
        font-size: 0.875rem;
    }

    .info-box li::before {
        content: "→";
        margin-right: 0.5rem;
        color: #60a5fa;
    }

    /* Toggle Switch Styles */
    .section-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .section-header-row h2 {
        margin-bottom: 0;
    }

    .toggle-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .toggle-label {
        color: #cbd5e1;
        font-weight: 500;
        font-size: 0.875rem;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #334155;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: #3b82f6;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #3b82f6;
    }

    input:checked + .slider:before {
        transform: translateX(24px);
    }

    .slider.round {
        border-radius: 24px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    /* Disabled state for inputs */
    .settings-grid.disabled {
        opacity: 0.6;
        pointer-events: none; /* Optional: prevent interaction with entire grid */
    }

    .settings-grid.disabled input {
        background-color: #0f172a; /* Darker bg */
        border-color: #334155;
        color: #64748b;
    }
</style>
