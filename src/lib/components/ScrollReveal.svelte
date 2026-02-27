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

	$effect(() => {
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setTimeout(() => {
							entry.target.classList.add('visible');
						}, delay * 120);
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});

	const dirClass = $derived(direction === 'left' ? 'from-left' : direction === 'right' ? 'from-right' : '');
</script>

<div bind:this={element} class="scroll-reveal {dirClass}">
	{@render children()}
</div>
