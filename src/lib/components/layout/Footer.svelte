<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { organizers } from '$lib/data/organizers';
	import { t } from '$lib/utils/i18n';
</script>

<footer class="bg-surface-100 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 mt-auto">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Organisers -->
			<div>
				<h3 class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">
					{m.footer_organised_by()}
				</h3>
				<ul class="space-y-2">
					{#each organizers as org}
						<li class="text-sm text-surface-600 dark:text-surface-300">
							{org.name} — {t(org.affiliation)}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Supported by -->
			<div>
				<h3 class="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">
					{m.footer_supported_by()}
				</h3>
				<p class="text-sm text-surface-600 dark:text-surface-300">
					STIAS — Stellenbosch Institute for Advanced Study
				</p>
			</div>
		</div>

		<div class="mt-8 pt-8 border-t border-surface-200 dark:border-surface-700 text-center">
			<p class="text-sm text-surface-500 dark:text-surface-400">
				&copy; {new Date().getFullYear()} DH & AI in African Studies Workshop. {m.footer_rights()}
			</p>
		</div>
	</div>
</footer>
