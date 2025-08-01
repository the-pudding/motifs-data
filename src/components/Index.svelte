<script>
	import Audio from "$components/Audio.svelte";
	import Motifs from "$components/Motifs.svelte";
	import motifsData from "$data/motifs.json";

	let motifs = $state(motifsData);
</script>

<main>
	<Audio bind:motifs />
	<Motifs bind:motifs />
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
