import { writable } from 'svelte/store';

// Global state stores
export const balance = writable<number>(0);
export const openPositions = writable<number>(0);
export const positions = writable<any[]>([]);
export const screenerData = writable<any[]>([]);
export const connectionStatus = writable<string>('connecting');

// Singleton WebSocket manager
class WebSocketManager {
    private ws: WebSocket | null = null;
    private reconnectTimeout: any = null;
    private isConnecting = false;

    connect() {
        if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected or connecting');
            return;
        }

        this.isConnecting = true;
        connectionStatus.set('connecting');

        try {
            this.ws = new WebSocket('ws://localhost:8080/ws');

            this.ws.onopen = () => {
                console.log('✅ Global WebSocket connected');
                connectionStatus.set('connected');
                this.isConnecting = false;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'status') {
                        balance.set(data.data.balance);
                        openPositions.set(data.data.open_positions);
                        positions.set(data.data.positions || []);
                    } else if (data.type === 'screener') {
                        screenerData.set(data.data);
                    } else if (data.type === 'entry_signal') {
                        console.log('🚨 ENTRY SIGNAL:', data.data);
                        this.showEntryNotification(data.data);
                    } else if (data.type === 'signal') {
                        console.log('New signal:', data.data);
                    }
                } catch (e) {
                    console.error('Failed to parse WebSocket message:', e);
                }
            };

            this.ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                connectionStatus.set('error');
                this.isConnecting = false;
            };

            this.ws.onclose = () => {
                console.log('WebSocket closed. Reconnecting in 3s...');
                connectionStatus.set('disconnected');
                this.isConnecting = false;

                // Auto-reconnect after 3 seconds
                this.reconnectTimeout = setTimeout(() => {
                    this.connect();
                }, 3000);
            };
        } catch (e) {
            console.error('Failed to create WebSocket:', e);
            connectionStatus.set('error');
            this.isConnecting = false;
        }
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnecting = false;
    }

    async requestNotificationPermission() {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    showEntryNotification(data: any) {
        const { symbol, signal, price, trend_score, signal_strength } = data;

        // Visual notification (always show)
        console.log(`🎯 ${signal} ENTRY: ${symbol} @ $${price}`);

        // Browser notification
        if (typeof window !== 'undefined' && Notification.permission === 'granted') {
            const title = `${signal} ${symbol}`;
            const body = `Entry NOW @ $${price}\nTrend: ${trend_score.toFixed(1)} | Strength: ${signal_strength.toFixed(0)}%`;

            const notification = new Notification(title, {
                body,
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                tag: symbol, // Prevent duplicates
                requireInteraction: false,
                silent: false
            });

            // Auto-close after 10 seconds
            setTimeout(() => notification.close(), 10000);

            // Optional: Click to focus window
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }
}

// Singleton instance
export const wsManager = new WebSocketManager();

// Auto-connect on module load (browser only)
if (typeof window !== 'undefined') {
    wsManager.connect();
}
