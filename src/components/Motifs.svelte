<script>
	import _ from "lodash";
	import Clip from "$components/Clip.svelte";
	import ArcViz from "$components/ArcViz.svelte";

	let { motifs = $bindable(), tracks, musicalId } = $props();

	const colorPalette = [
		"#FF4B4B",
		"#FF784B",
		"#FFB84B",
		"#FFE84B",
		"#D4FF4B",
		"#92FF4B",
		"#4BFF6B",
		"#4BFFB8",
		"#4BFFF0",
		"#4BDAFF",
		"#4BB3FF",
		"#4B7CFF",
		"#4B4BFF",
		"#7C4BFF",
		"#B84BFF",
		"#F04BFF",
		"#FF4BDA",
		"#FF4BA3",
		"#FF4B6E",
		"#FF6E4B",
		"#FF9C4B",
		"#FFD04B",
		"#E0FF4B",
		"#A8FF4B",
		"#68FF4B",
		"#4BFF92",
		"#4BFFD4",
		"#4BE8FF",
		"#4BB8FF",
		"#4B88FF",
		"#6E4BFF",
		"#9C4BFF",
		"#D44BFF",
		"#FF4BF0",
		"#FF4BC8",
		"#FF4B96",
		"#FF4B64",
		"#FF704B",
		"#FFA84B",
		"#FFE04B",
		"#C8FF4B",
		"#88FF4B",
		"#4BFF78",
		"#4BFFB0",
		"#4BFFE0",
		"#4BC8FF",
		"#4B96FF",
		"#704BFF",
		"#A84BFF",
		"#E04BFF"
	];

	const motifColors = $derived(
		motifs.reduce((acc, motif, i) => {
			acc[motif.name] = colorPalette[i % colorPalette.length];
			return acc;
		}, {})
	);

	let bigVizSelectedMotifs = $derived(motifs ? motifs.map((m) => m.name) : []);
	let selectedMotif = $state("look down");
	let clipPlaying = $state();
	let sortedMotifs = $derived(
		[...motifs].sort((a, b) => b.regions.length - a.regions.length)
	);
	let filteredMotifs = $derived(
		sortedMotifs.filter((m) => m.name === selectedMotif)
	);

	const motifChange = () => {
		clipPlaying = undefined;
	};
	$effect(() => motifChange(selectedMotif));
</script>

<div class="motifs">
	<ArcViz
		motifs={motifs.filter((d) => bigVizSelectedMotifs.includes(d.name))}
		alternate={true}
		{motifColors}
		{tracks}
	/>
	<div class="checkboxes">
		<button onclick={() => (bigVizSelectedMotifs = motifs.map((m) => m.name))}
			>ALL</button
		>
		<button onclick={() => (bigVizSelectedMotifs = [])}>CLEAR</button>
		{#each sortedMotifs as motif}
			<label>
				<input
					type="checkbox"
					bind:group={bigVizSelectedMotifs}
					value={motif.name}
				/>
				{motif.emoji}
				{motif.name} ({motif.regions.length})
			</label>
		{/each}
	</div>

	{#if sortedMotifs && sortedMotifs.length > 0}
		<ul>
			{#each sortedMotifs.filter((m) => m.regions.length > 0) as motif}
				{@const numOccurences = motif.regions.length}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					class:selected={selectedMotif === motif.name}
					onclick={() => (selectedMotif = motif.name)}
				>
					<h3 class="name">{motif.emoji} {motif.name} ({numOccurences})</h3>

					{#if selectedMotif === motif.name}
						<ArcViz motifs={filteredMotifs} {motifColors} {tracks} />
					{/if}

					{#if selectedMotif === motif.name}
						<div class="regions">
							{#each _.orderBy(motif.regions, "track-name") as region}
								<Clip
									id={region.id}
									trackName={region["track-name"]}
									src={`assets/audio/${musicalId}/${region["track-name"]}.mp3`}
									start={region.start}
									end={region.end}
									bind:clipPlaying
								/>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p>No motifs.</p>
	{/if}
</div>

<style>
	.motifs {
		width: 100%;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	h3 {
		margin: 0;
	}

	li {
		padding: 0.5rem;
	}

	li:hover {
		cursor: pointer;
	}

	li.selected {
		background: var(--color-gray-600);
	}

	.regions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	input[type="checkbox"] {
		appearance: auto; /* or remove appearance entirely */
		-webkit-appearance: checkbox; /* for Safari */
		-moz-appearance: checkbox; /* for Firefox */
		accent-color: var(--color-accent, #0070f3); /* optional: modern browsers */
		outline: none;
	}
</style>
