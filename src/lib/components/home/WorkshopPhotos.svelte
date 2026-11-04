<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { staticAsset } from '#lib/utils/base-path.ts';
	import ScrollReveal from '#lib/components/ScrollReveal.svelte';

	// Two group photos from the workshop itself. Each ships at 800 and 1600 px
	// wide, so a phone on mobile data fetches the ~60–100 kB version.
	// `ratio` is width / height of the source. On desktop it is each figure's
	// flex-grow, so widths are proportional to it and both photos end up the
	// same height without cropping anyone off the edge of a group shot.
	const photos = $derived([
		{
			name: 'group-stias',
			width: 1600,
			height: 1205,
			ratio: 1.328,
			alt: m.photos_stias_alt(),
			caption: m.photos_stias_caption()
		},
		{
			name: 'group-ou-hoofgebou',
			width: 1600,
			height: 900,
			ratio: 1.778,
			alt: m.photos_hoofgebou_alt(),
			caption: m.photos_hoofgebou_caption()
		}
	]);

	const src = (name: string, w: number) => staticAsset(`/images/workshop/${name}-${w}.webp`);
</script>

<section class="section-pad">
	<div class="container-wide">
		<ScrollReveal>
			<div class="mb-10">
				<span class="text-eyebrow mb-3 inline-block">{m.section_photos()}</span>
			</div>
			<div class="flex flex-col gap-6 md:flex-row">
				{#each photos as photo (photo.name)}
					<figure class="m-0 min-w-0 md:basis-0" style:flex-grow={photo.ratio}>
						<img
							src={src(photo.name, 800)}
							srcset="{src(photo.name, 800)} 800w, {src(photo.name, 1600)} 1600w"
							sizes="(min-width: 768px) 50vw, 100vw"
							width={photo.width}
							height={photo.height}
							alt={photo.alt}
							loading="lazy"
							decoding="async"
							class="block h-auto w-full rounded-md"
						/>
						<figcaption class="text-muted text-caption mt-3">{photo.caption}</figcaption>
					</figure>
				{/each}
			</div>
		</ScrollReveal>
	</div>
</section>
