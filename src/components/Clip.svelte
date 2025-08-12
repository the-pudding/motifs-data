<script>
	let { id, src, trackName, start, end, clipPlaying = $bindable() } = $props();

	let audioEl;
	let currentTime = $state(start);
	let percentProgress = $derived(((currentTime - start) / (end - start)) * 100);

	const onClick = () => {
		if (clipPlaying === id) clipPlaying = undefined;
		else clipPlaying = id;
	};

	const onTimeUpdate = () => {
		if (currentTime >= end) {
			clipPlaying = undefined;
			audioEl.pause();
			audioEl.currentTime = start;
		}
	};

	$effect(() => {
		if (!audioEl) return;

		if (clipPlaying === id) {
			audioEl.currentTime = start;
			audioEl.play();
		} else if (clipPlaying !== id) {
			audioEl.pause();
			audioEl.currentTime = start;
		}
	});
</script>

<audio {src} bind:this={audioEl} bind:currentTime ontimeupdate={onTimeUpdate} />

<div>
	<button onclick={onClick}
		>{trackName} @ {(start / 60).toFixed(0)}m{(
			start -
			Math.floor(start / 60) * 60
		).toFixed(0)}s</button
	>
	<div class="progress" style:width={`${percentProgress}%`}></div>
</div>

<style>
	button {
		font-size: 14px;
	}

	.progress {
		height: 4px;
		background: var(--color-green);
	}
</style>
