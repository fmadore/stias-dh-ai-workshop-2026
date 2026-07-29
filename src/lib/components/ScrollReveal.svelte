<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		delay = 0,
		direction = 'up',
		threshold = 0.15
	}: {
		children: Snippet;
		delay?: number;
		direction?: 'up' | 'left' | 'right';
		threshold?: number;
	} = $props();

	let element: HTMLElement | undefined = $state();

	// Cap the stagger at three steps. Reveal section containers, not their
	// children — an unbounded delay={i} over a list means the last item lands
	// most of a second after the reader has already arrived at it.
	const steps = $derived(Math.min(Math.max(delay, 0), 3));

	$effect(() => {
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setTimeout(() => {
							entry.target.classList.add('visible');
						}, steps * 120);
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});

	const dirClass = $derived(
		direction === 'left' ? 'from-left' : direction === 'right' ? 'from-right' : ''
	);
</script>

<div bind:this={element} class="scroll-reveal {dirClass}">
	{@render children()}
</div>
