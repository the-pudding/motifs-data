<script>
	import AudioPlayer from "$components/AudioPlayer.svelte";
	import tracks from "$data/tracks.json";
	import { onMount } from "svelte";

	let { motifs = $bindable(), selectedTrack = $bindable() } = $props();

	onMount(() => {
		console.log("audio onmount");
	});
</script>

<div class="audio">
	<h2>Les Misérables</h2>

	{#if selectedTrack}
		<AudioPlayer
			name={selectedTrack.name}
			src={selectedTrack.file}
			bind:motifs
		/>
	{/if}

	<ol>
		{#each tracks as track}
			<li
				class:selected={selectedTrack?.name === track.name}
				onclick={() => (selectedTrack = track)}
			>
				<h3>{track.name}</h3>
			</li>
		{/each}
	</ol>
</div>

<style>
	.audio {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 3;
	}

	ol {
		padding: 0;
		list-style: none;
		overflow: scroll;
	}

	h3 {
		margin: 0;
	}

	li {
		padding: 0.25rem;
	}

	li.selected {
		background: var(--color-gray-700);
	}

	li:hover:not(.selected) {
		cursor: pointer;
		background: var(--color-gray-800);
	}
</style>
