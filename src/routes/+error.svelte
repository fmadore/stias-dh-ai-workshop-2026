<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/utils/i18n';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{page.status === 404 ? m.error_404_title() : m.error_generic_title()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="section-pad-lg">
	<div class="container-readable text-center">
		<p class="text-eyebrow mb-4">{page.status}</p>
		<h1 class="text-page-title text-ink dark:text-surface-50 mb-5">
			{page.status === 404 ? m.error_404_title() : m.error_generic_title()}
		</h1>
		{#if page.status === 404}
			<p class="text-lede mx-auto mb-10 max-w-xl">{m.error_404_text()}</p>
		{/if}
		<a href={localePath('/')} class="btn btn-primary">
			<ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
			{m.error_back_home()}
		</a>
	</div>
</div>
