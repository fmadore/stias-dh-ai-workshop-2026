<script lang="ts">
	let {
		title,
		subtitle = ''
	}: {
		title: string;
		subtitle?: string;
	} = $props();
</script>

<header class="pt-16 pb-10 sm:pt-20 sm:pb-14">
	<div class="container-readable">
		<span class="accent-rule mb-6" aria-hidden="true"></span>
		<h1 class="text-page-title text-ink dark:text-surface-50">{title}</h1>
		{#if subtitle}
			<p class="text-lede mt-4 max-w-2xl">{subtitle}</p>
		{/if}
	</div>
</header>
