<script>
	import Audio from "$components/Audio.svelte";

	let selectedTrack = $state(null);
</script>

<main>
	<Audio bind:selectedTrack />

	<div class="motifs">
		<h2>Motifs</h2>
	</div>
</main>

<style>
	main {
		height: 100svh;
		display: flex;
		gap: 1rem;
		padding: 4rem;
		padding-bottom: 2rem;
	}
</style>
