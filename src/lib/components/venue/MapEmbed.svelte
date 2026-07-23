<script lang="ts">
	import { venueInfo } from '$lib/data/venue';
	import * as m from '$lib/paraglide/messages';

	const { lat, lng } = venueInfo.coordinates;
	const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.005}%2C${lng + 0.01}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;
</script>

<div class="card border-surface-200 dark:border-surface-700 overflow-hidden border">
	<iframe
		title={m.map_title()}
		width="100%"
		height="420"
		src={mapUrl}
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
		class="block border-0"
	></iframe>
</div>
