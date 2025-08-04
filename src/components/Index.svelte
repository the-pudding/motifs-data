<script>
	import Audio from "$components/Audio.svelte";
	import Motifs from "$components/Motifs.svelte";
	import tracks from "$data/tracks.json";
	import { onMount } from "svelte";

	let motifs = $state([]);
	let selectedTrack = $state(tracks[0]);
	let savedMessage = $state("");

	onMount(async () => {
		const res = await fetch("/data/motifs.json");
		motifs = await res.json();
	});
</script>

<main>
	<Audio bind:motifs bind:selectedTrack bind:savedMessage />
	<Motifs bind:motifs {savedMessage} />
</main>

<style>
	main {
		height: 100svh;
		display: flex;
		gap: 5rem;
		padding: 4rem;
		padding-bottom: 2rem;
	}
</style>
