<script>
	import { onMount, onDestroy } from "svelte";
	import WaveSurfer from "wavesurfer.js";

	const { src, name } = $props();

	let container;
	let wavesurfer;

	$effect(() => {
		wavesurfer = WaveSurfer.create({
			container,
			waveColor: "#CCBB44",
			progressColor: "#EE6677",
			height: "auto",
			responsive: true
		});

		wavesurfer.load(src);

		return () => {
			if (wavesurfer) wavesurfer.destroy();
		};
	});

	const togglePlay = () => {
		if (wavesurfer) {
			wavesurfer.playPause();
		}
	};
</script>

<div class="player">
	<h2>{name}</h2>
	<div bind:this={container} class="waveform"></div>
	<button onclick={togglePlay}>Play / Pause</button>
</div>

<style>
	.waveform {
		width: 100%;
		margin-bottom: 0.5rem;
	}
</style>
