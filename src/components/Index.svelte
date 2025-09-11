<script>
	import Audio from "$components/Audio.svelte";
	import MotifsPreview from "$components/MotifsPreview.svelte";
	import Motifs from "$components/Motifs.svelte";
	import Characters from "$components/Characters.svelte";
	import AllRegions from "$components/AllRegions.svelte";
	import lesMisTracks from "$data/lesmis-tracks.json";
	import hamiltonTracks from "$data/hamilton-tracks.json";
	import wickedTracks from "$data/wicked-tracks.json";
	import { onMount } from "svelte";

	const musicalId = "wicked";
	const tracksMap = {
		lesmis: lesMisTracks,
		hamilton: hamiltonTracks,
		wicked: wickedTracks
	};
	const tracks = tracksMap[musicalId];

	let view = $state("characters");
	let motifs = $state([]);
	let selectedTrack = $state(tracks[0]);
	let savedMessage = $state("");

	onMount(async () => {
		const res = await fetch(`data/${musicalId}-motifs.json`);
		motifs = await res.json();
	});
</script>

<main class:fixed={view === "edit"}>
	<div class="header">
		<h2>{musicalId}</h2>
		<button class:selected={view === "edit"} onclick={() => (view = "edit")}
			>Edit regions</button
		>

		<button class:selected={view === "motifs"} onclick={() => (view = "motifs")}
			>Motifs</button
		>

		<button
			class:selected={view === "characters"}
			onclick={() => (view = "characters")}>Refine</button
		>
	</div>

	<section>
		{#if view === "edit"}
			<Audio
				bind:motifs
				bind:selectedTrack
				bind:savedMessage
				{tracks}
				{musicalId}
			/>
			<MotifsPreview bind:motifs {savedMessage} />
		{:else if view === "regions"}
			<AllRegions {motifs} {tracks} />
		{:else if view === "motifs"}
			<Motifs bind:motifs {tracks} {musicalId} />
		{:else if view === "characters"}
			<Characters bind:motifs {tracks} {musicalId} />
		{/if}
	</section>
</main>

<style>
	main {
		height: 100svh;
		padding: 4rem;
		padding-bottom: 8rem;
		overflow: auto;
	}

	main.fixed {
		overflow: hidden;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	section {
		display: flex;
		gap: 5rem;
	}

	.fixed section {
		height: 100%;
	}

	button.selected {
		background: var(--color-gray-700);
		color: var(--color-white);
		border: 2px solid var(--color-white);
	}
</style>
