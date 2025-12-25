<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	let sidebarOpen = $state(true);
	
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
	
	onMount(() => {
		// Auto-collapse on mobile
		if (window.innerWidth < 768) {
			sidebarOpen = false;
		}
	});
	
	const navItems = [
		{ href: '/', icon: '📊', label: 'Dashboard' },
		{ href: '/screener', icon: '🎯', label: 'Screener' },
		{ href: '/positions', icon: '📈', label: 'Positions' },
		{ href: '/history', icon: '📜', label: 'History' },
		{ href: '/analytics', icon: '📉', label: 'Analytics' },
		{ href: '/settings', icon: '⚙️', label: 'Settings' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<!-- Sidebar -->
	<aside class="sidebar" class:collapsed={!sidebarOpen}>
		<div class="sidebar-header">
			<div class="logo">
				<span class="logo-icon">⚡</span>
				{#if sidebarOpen}
					<span class="logo-text">Scalping Pro</span>
				{/if}
			</div>
			<button class="toggle-btn" onclick={toggleSidebar}>
				{sidebarOpen ? '◀' : '▶'}
			</button>
		</div>
		
		<nav class="sidebar-nav">
			{#each navItems as item}
				<a 
					href={item.href} 
					class="nav-item" 
					class:active={$page.url.pathname === item.href}
				>
					<span class="nav-icon">{item.icon}</span>
					{#if sidebarOpen}
						<span class="nav-label">{item.label}</span>
					{/if}
				</a>
			{/each}
		</nav>
		
		<div class="sidebar-footer">
			{#if sidebarOpen}
				<div class="user-info">
					<div class="status-dot"></div>
					<span>System Online</span>
				</div>
			{/if}
		</div>
	</aside>
	
	<!-- Main Content -->
	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
	}

	.app-layout {
		display: flex;
		height: 100vh;
		background: #0a0e1a;
		color: #e2e8f0;
		overflow: hidden;
	}
	
	.sidebar {
		width: 260px;
		background: linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%);
		border-right: 1px solid #2d3748;
		display: flex;
		flex-direction: column;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		z-index: 100;
	}
	
	.sidebar.collapsed {
		width: 70px;
	}
	
	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1rem;
		border-bottom: 1px solid #2d3748;
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 600;
		font-size: 1.25rem;
	}
	
	.logo-icon {
		font-size: 1.5rem;
		filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
	}
	
	.logo-text {
		background: linear-gradient(135deg, #ffd700, #ff8c00);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		white-space: nowrap;
	}
	
	.toggle-btn {
		background: #2d3748;
		border: none;
		color: #a0aec0;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	
	.toggle-btn:hover {
		background: #4a5568;
		color: #e2e8f0;
	}
	
	.sidebar-nav {
		flex: 1;
		padding: 1rem 0;
		overflow-y: auto;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.875rem 1.25rem;
		margin: 0.25rem 0.75rem;
		border-radius: 10px;
		text-decoration: none;
		color: #a0aec0;
		transition: all 0.2s;
		font-weight: 500;
		white-space: nowrap;
	}
	
	.nav-item:hover {
		background: rgba(255, 255, 255, 0.05);
		color: #e2e8f0;
		transform: translateX(4px);
	}
	
	.nav-item.active {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
		color: #60a5fa;
		border-left: 3px solid #3b82f6;
	}
	
	.nav-icon {
		font-size: 1.5rem;
		min-width: 28px;
		text-align: center;
	}
	
	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid #2d3748;
	}
	
	.user-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #68d391;
	}
	
	.status-dot {
		width: 8px;
		height: 8px;
		background: #68d391;
		border-radius: 50%;
		animation: pulse 2s infinite;
	}
	
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
			box-shadow: 0 0 8px rgba(104, 211, 145, 0.6);
		}
		50% {
			opacity: 0.6;
			box-shadow: 0 0 12px rgba(104, 211, 145, 0.8);
		}
	}
	
	.main-content {
		flex: 1;
		overflow-y: auto;
		background: #0a0e1a;
	}
	
	/* Mobile Responsive */
	@media (max-width: 768px) {
		.sidebar:not(.collapsed) {
			position: absolute;
			height: 100%;
			box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
		}
	}
	
	/* Scrollbar styling */
	.sidebar-nav::-webkit-scrollbar {
		width: 6px;
	}
	
	.sidebar-nav::-webkit-scrollbar-track {
		background: transparent;
	}
	
	.sidebar-nav::-webkit-scrollbar-thumb {
		background: #2d3748;
		border-radius: 3px;
	}
	
	.sidebar-nav::-webkit-scrollbar-thumb:hover {
		background: #4a5568;
	}
</style>
