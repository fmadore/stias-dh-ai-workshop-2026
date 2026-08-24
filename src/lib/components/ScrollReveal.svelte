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
	 *
	 * That 0.15 was then found to be a defect of its own, and a serious one:
	 * a ratio is a fraction of the ELEMENT, so an element taller than ~6.7
	 * viewports can never reach it. At 320×640 the `/about` abstract is 4905px
	 * in English and 5703px in French, whose best possible ratios are 0.130 and
	 * 0.112 — so the observer never fired and the workshop's central argument
	 * simply did not appear, on an ordinary scroll from the top. A threshold of
	 * 0 fires on the first pixel and cannot be out of reach at any size.
	 */
	const THRESHOLD = 0;

	/**
	 * The root's top edge, pushed far enough up that everything the reader has
	 * already scrolled past still counts as intersecting. This is what makes
	 * "has the reader reached it" the question the observer answers, instead of
	 * "is it on screen right now" — which is not the same question, and got the
	 * wrong answer for every element a jump skipped. Those were never
	 * intersecting and never would be again, so they stayed at opacity 0 for
	 * good: a reload with scroll restoration hid all nine sections of the call
	 * for papers, and back-navigation or the End key hid the whole of /about.
	 *
	 * Testing `boundingClientRect.top < 0` in the callback fixes the reload
	 * case and not the jump-mid-session case, because an element that goes from
	 * below the viewport to above it crosses no threshold — ratio 0 before,
	 * ratio 0 after — so no callback ever fires. Moving the edge instead means
	 * the crossing is real and the browser reports it.
	 *
	 * Only the top edge moves. An element still below the fold is as
	 * unintersecting as it ever was, so nothing reveals early.
	 */
	const ROOT_MARGIN = '100000px 0px 0px 0px';

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
			{ threshold: THRESHOLD, rootMargin: ROOT_MARGIN }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<div bind:this={element} class="scroll-reveal">
	{@render children()}
</div>
