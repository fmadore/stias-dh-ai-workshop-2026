<script lang="ts">
	let {
		title,
		subtitle = ''
	}: {
		title: string;
		subtitle?: string;
	} = $props();
</script>

<header class="pt-12 pb-8 sm:pt-16 sm:pb-12">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="relative">
			<!-- Decorative accent line -->
			<div
				class="from-secondary-400 to-secondary-500 mb-6 h-1 w-12 rounded-full bg-gradient-to-r"
			></div>
			<h1
				class="text-surface-900 dark:text-surface-50 text-4xl font-normal tracking-tight sm:text-5xl"
			>
				{title}
			</h1>
			{#if subtitle}
				<p
					class="text-surface-500 dark:text-surface-400 mt-4 max-w-2xl font-sans text-lg font-light"
				>
					{subtitle}
				</p>
			{/if}
		</div>
	</div>
</header>
