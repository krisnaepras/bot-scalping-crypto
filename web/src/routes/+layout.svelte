<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import Icon from "@iconify/svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	let { children } = $props();
	let sidebarOpen = $state(true);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	onMount(() => {
		if (window.innerWidth < 768) {
			sidebarOpen = false;
		}
	});

	const navItems = [
		{ href: "/", icon: "mdi:view-dashboard", label: "Dashboard" },
		{ href: "/screener", icon: "mdi:magnify", label: "Scanner" },
		{ href: "/positions", icon: "mdi:chart-line", label: "Trades" },
		{ href: "/history", icon: "mdi:history", label: "History" },
		{ href: "/analytics", icon: "mdi:chart-bar", label: "Analytics" },
		{ href: "/settings", icon: "mdi:cog", label: "Settings" },
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<aside class="sidebar" class:collapsed={!sidebarOpen}>
		<div class="sidebar-header">
			<div class="logo">
				<div class="logo-icon-wrapper">
					<Icon icon="mdi:lightning-bolt" width="24" />
				</div>
				{#if sidebarOpen}
					<span class="logo-text">ScalpPRO</span>
				{/if}
			</div>
		</div>

		<nav class="sidebar-nav">
			{#each navItems as item}
				<a
					href={item.href}
					class="nav-item"
					class:active={$page.url.pathname === item.href}
				>
					<span class="nav-icon">
						<Icon icon={item.icon} width="20" />
					</span>
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
					<span class="font-mono text-xs">SYSTEM ONLINE</span>
				</div>
			{/if}
		</div>
	</aside>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	.app-layout {
		display: flex;
		height: 100vh;
		background: var(--bg-app);
		color: var(--text-primary);
		overflow: hidden;
	}

	.sidebar {
		width: 260px;
		background: var(--bg-surface);
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 50;
	}

	.sidebar.collapsed {
		width: 80px;
	}

	.sidebar-header {
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid var(--border-color);
	}

	.sidebar.collapsed .sidebar-header {
		padding: 0;
	}

	.sidebar:not(.collapsed) .sidebar-header {
		justify-content: flex-start;
		padding-left: 1.5rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--text-primary);
		letter-spacing: -0.02em;
	}

	.logo-icon-wrapper {
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, var(--accent-primary), #2563eb);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px var(--accent-glow);
		color: white;
	}

	.sidebar-nav {
		flex: 1;
		padding: 1.5rem 0.75rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 1rem;
		height: 48px;
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--text-secondary);
		transition: all 0.2s;
		font-weight: 500;
		white-space: nowrap;
		position: relative;
	}

	.sidebar.collapsed .nav-item {
		padding: 0;
		justify-content: center;
	}

	.nav-item:hover {
		color: var(--text-primary);
		background: rgba(255, 255, 255, 0.03);
	}

	.nav-item.active {
		background: rgba(59, 130, 246, 0.1);
		color: var(--accent-primary);
	}

	.nav-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
	}

	.sidebar-footer {
		padding: 1.5rem;
		border-top: 1px solid var(--border-color);
		display: flex;
		justify-content: center;
	}

	.sidebar:not(.collapsed) .sidebar-footer {
		justify-content: flex-start;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.75rem;
		color: var(--text-muted);
		letter-spacing: 0.05em;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		background: var(--status-success);
		border-radius: 50%;
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
		}
		70% {
			opacity: 1;
			box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
		}
		100% {
			opacity: 1;
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
		}
	}

	.main-content {
		flex: 1;
		overflow-y: auto;
		background: var(--bg-app);
		padding: 0;
	}

	@media (max-width: 768px) {
		.sidebar:not(.collapsed) {
			position: fixed;
			height: 100%;
			width: 80%;
			box-shadow: var(--shadow-lg);
		}
	}
</style>
