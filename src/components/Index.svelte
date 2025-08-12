<script>
	import Audio from "$components/Audio.svelte";
	import MotifsPreview from "$components/MotifsPreview.svelte";
	import Motifs from "$components/Motifs.svelte";
	import AllRegions from "$components/AllRegions.svelte";
	import tracks from "$data/tracks.json";
	import { onMount } from "svelte";

	let view = $state("motifs");
	let motifs = $state([]);
	let selectedTrack = $state(tracks[0]);
	let savedMessage = $state("");

	onMount(async () => {
		const res = await fetch("/data/motifs.json");
		motifs = await res.json();
	});
</script>

<main class:fixed={view === "edit"}>
	<div class="header">
		<h2>Les Misérables</h2>
		<button class:selected={view === "edit"} onclick={() => (view = "edit")}
			>Edit regions</button
		>
		<button
			class:selected={view === "regions"}
			onclick={() => (view = "regions")}>All regions</button
		>
		<button class:selected={view === "motifs"} onclick={() => (view = "motifs")}
			>Motifs</button
		>
	</div>

	<section>
		{#if view === "edit"}
			<Audio bind:motifs bind:selectedTrack bind:savedMessage />
			<MotifsPreview bind:motifs {savedMessage} />
		{:else if view === "regions"}
			<AllRegions {motifs} />
		{:else if view === "motifs"}
			<Motifs bind:motifs />
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
		/* height: 100%; */
	}

	button.selected {
		background: var(--color-gray-700);
		color: var(--color-white);
		border: 2px solid var(--color-white);
	}
</style>
