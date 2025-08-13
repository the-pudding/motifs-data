<script>
	import _ from "lodash";
	import Clip from "$components/Clip.svelte";
	import ArcViz from "$components/ArcViz.svelte";

	let { motifs = $bindable(), tracks, musicalId } = $props();

	const colorPalette = [
		"#2F4F4F",
		"#00FF7F",
		"#FFFFF0",
		"#DA70D6",
		"#000000",
		"#C0C0C0",
		"#6495ED",
		"#FF7F50",
		"#ADD8E6",
		"#696969",
		"#FF6347",
		"#006400",
		"#00FFFF",
		"#F0FFF0",
		"#DB7093",
		"#FF0000",
		"#8FBC8F",
		"#6B8E23",
		"#4169E1",
		"#FFFF00",
		"#8B008B",
		"#8A2BE2",
		"#DCDCDC",
		"#FFE4B5",
		"#F08080",
		"#DEB887",
		"#00008B",
		"#D2B48C",
		"#F5DEB3",
		"#708090",
		"#FFEBCD",
		"#2E8B57",
		"#DDA0DD",
		"#FAF0E6",
		"#FFFFE0",
		"#9370DB",
		"#48D1CC",
		"#008080",
		"#A52A2A",
		"#FFF8DC",
		"#3CB371",
		"#FFFAFA",
		"#FFE4C4",
		"#FFDEAD",
		"#FA8072",
		"#B0C4DE",
		"#F5FFFA",
		"#008000"
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
