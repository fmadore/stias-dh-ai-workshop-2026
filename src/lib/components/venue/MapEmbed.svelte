<script lang="ts">
	import { venueInfo } from '$lib/data/venue';

	const { lat, lng } = venueInfo.coordinates;
	const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.005}%2C${lng + 0.01}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;
</script>

<div class="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm">
	<iframe
		title="STIAS Location Map"
		width="100%"
		height="400"
		src={mapUrl}
		style="border: 0;"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
	></iframe>
</div>
