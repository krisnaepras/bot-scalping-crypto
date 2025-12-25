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
}

// Singleton instance
export const wsManager = new WebSocketManager();

// Auto-connect on module load (browser only)
if (typeof window !== 'undefined') {
    wsManager.connect();
}
