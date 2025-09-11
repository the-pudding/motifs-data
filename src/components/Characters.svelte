<script>
	import Region from "$components/Characters.Region.svelte";
	import _ from "lodash";

	let { motifs = $bindable(), tracks, musicalId } = $props();

	const sortMotifRegions = (motifs) => {
		const parseTrackName = (trackName) => {
			const match = trackName.match(/^(\d+)-(\d+)/);
			if (!match) return { act: Infinity, song: Infinity };
			return {
				act: parseInt(match[1], 10),
				song: parseInt(match[2], 10)
			};
		};

		return motifs.map((motif) => {
			// 1) Keep only one region per track-name: the one with the lowest start
			const byTrack = new Map();
			for (const r of motif.regions) {
				const key = r["track-name"];
				const prev = byTrack.get(key);
				if (
					!prev ||
					Number(r.start) < Number(prev.start) ||
					(Number(r.start) === Number(prev.start) &&
						Number(r.end) < Number(prev.end))
				) {
					byTrack.set(key, r);
				}
			}

			const filtered = Array.from(byTrack.values());

			// 2) Sort by act, then song, then track-name
			const sortedRegions = filtered.sort((a, b) => {
				const A = parseTrackName(a["track-name"]);
				const B = parseTrackName(b["track-name"]);
				if (A.act !== B.act) return A.act - B.act;
				if (A.song !== B.song) return A.song - B.song;
				if (a["track-name"] !== b["track-name"]) {
					return a["track-name"].localeCompare(b["track-name"]);
				}
				return Number(a.start) - Number(b.start);
			});

			return { ...motif, regions: sortedRegions };
		});
	};

	let selectedMotif = $state(motifs[0]?.name || "look down");
	let filteredMotifs = $derived(
		sortMotifRegions(motifs.filter((m) => m.regions.length > 0))
	);
	let characterOptions = $derived(
		motifs.reduce((acc, motif) => {
			motif.regions.forEach((region) => {
				if (region.character) {
					region.character.forEach((character) => {
						if (!acc.includes(character)) {
							acc.push(character);
						}
					});
				}
			});
			return acc;
		}, [])
	);
</script>

<div class="characters">
	<ul>
		{#each filteredMotifs as motif}
			{@const numOccurences = motif.regions.length}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<li
				class:selected={selectedMotif === motif.name}
				onclick={() => (selectedMotif = motif.name)}
			>
				<h3 class="name">{motif.emoji} {motif.name} ({numOccurences})</h3>

				{#if selectedMotif === motif.name}
					<div class="regions">
						{#each _.orderBy(motif.regions, "track-name") as region}
							<Region
								bind:motifs
								{region}
								{musicalId}
								motifName={motif.name}
								{characterOptions}
							/>
						{/each}
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.characters {
		width: 100%;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	.regions {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	li:not(.selected):hover {
		cursor: pointer;
		background: var(--color-gray-600);
	}
</style>
