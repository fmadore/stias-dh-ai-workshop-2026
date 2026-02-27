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
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative">
			<!-- Decorative accent line -->
			<div
				class="w-12 h-1 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full mb-6"
			></div>
			<h1
				class="text-4xl sm:text-5xl font-normal tracking-tight text-surface-900 dark:text-surface-50"
			>
				{title}
			</h1>
			{#if subtitle}
				<p
					class="mt-4 text-lg text-surface-500 dark:text-surface-400 font-sans font-light max-w-2xl"
				>
					{subtitle}
				</p>
			{/if}
		</div>
	</div>
</header>
