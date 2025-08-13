<script>
	import AudioPlayer from "$components/AudioPlayer.svelte";

	let { motifs, tracks } = $props();

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
</script>

<figure>
	{#each tracks as { name, file }}
		<AudioPlayer src={file} {name} editable={false} {motifs} {motifColors} />
	{/each}
</figure>

<style>
	figure {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.track {
		height: 2rem;
		background-color: var(--color-gray-500);
		border-radius: 0.5rem;
	}
</style>
