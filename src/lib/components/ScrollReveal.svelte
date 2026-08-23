<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let element: HTMLElement | undefined = $state();

	/**
	 * A stagger needs a group. This observes one element and fires when that
	 * element enters the viewport, so a `delay` prop did not stagger anything —
	 * it postponed a section that was already on screen. Measured on the call
	 * for papers, where ten sections passed `delay={0..9}`: eight of them
	 * appeared 361–378ms after the reader had arrived at them, which is
	 * latency wearing a stagger's name. The prop is gone, and with it the cap
	 * that had been quietly flattening seven of those nine values to the same
	 * number.
	 *
	 * `direction` went the same way with no call site ever having set it, and
	 * `threshold` with no call site ever having overridden 0.15.
	 */
	const THRESHOLD = 0.15;

	$effect(() => {
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			},
			{ threshold: THRESHOLD }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<div bind:this={element} class="scroll-reveal">
	{@render children()}
</div>
