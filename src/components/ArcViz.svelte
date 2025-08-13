<script>
	import { scaleLinear } from "d3-scale";

	let { motifs = [], alternate = false, motifColors, tracks } = $props();

	const getFullTimestamp = (trackName, timestamp) => {
		const track = tracks.find((t) => t.name === trackName);
		if (!track) return 0;
		const trackStart = tracks
			.slice(0, tracks.indexOf(track))
			.reduce((total, track) => total + track.duration, 0);
		return trackStart + timestamp;
	};

	const totalMusicalDuration = tracks.reduce(
		(total, track) => total + track.duration,
		0
	);

	const height = 250;
	const curvature = 0.35;
	const midY = $derived(height / 2);
	let width = $state();
	let xScale = $derived(
		scaleLinear().domain([0, totalMusicalDuration]).range([0, width])
	);
	let pointsByMotif = $derived(
		motifs.reduce((acc, motif) => {
			const pts = motif.regions
				? motif.regions
						.map((region) => ({
							x: xScale(getFullTimestamp(region["track-name"], region.start)),
							y: midY
						}))
						.sort((a, b) => a.x - b.x)
				: [];

			acc[motif.name] = pts;
			return acc;
		}, {})
	);
	const firstSongOfAct2 = tracks.find((d) => d.name.includes("2-01")).name;

	function arcPath(p1, p2, i) {
		const dx = Math.max(0, p2.x - p1.x);
		if (dx === 0) return "";

		const h = Math.min(80, dx * curvature);
		const dir = alternate ? (i % 2 === 0 ? -1 : 1) : -1;

		const cx = (p1.x + p2.x) / 2;
		const cy = midY + dir * h;

		return `M ${p1.x},${p1.y} Q ${cx},${cy} ${p2.x},${p2.y}`;
	}
</script>

<div
	class="chart-container"
	style:height={`${height}px`}
	bind:clientWidth={width}
>
	<svg>
		<line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" />
		<!-- line where track containing "2-01" begins -->
		<line
			x1={xScale(getFullTimestamp(firstSongOfAct2, 0))}
			y1="20%"
			x2={xScale(getFullTimestamp(firstSongOfAct2, 0))}
			y2="80%"
			stroke="white"
			stroke-width="1"
			stroke-dasharray="4"
		/>

		{#each Object.entries(pointsByMotif) as [name, points]}
			{#each points as p}
				<circle
					cx={p.x}
					cy={p.y}
					r="4"
					fill={motifColors[name]}
					stroke="var(--color-gray-500)"
					stroke-width="1"
				/>
			{/each}

			{#each points as p, i (i)}
				{#if i < points.length - 1}
					<path
						d={arcPath(points[i], points[i + 1], i)}
						fill="none"
						stroke={motifColors[name]}
						stroke-width="1"
						vector-effect="non-scaling-stroke"
					/>
				{/if}
			{/each}
		{/each}
	</svg>
</div>

<style>
	.chart-container {
		width: 100%;
	}

	svg {
		height: 100%;
		width: 100%;
	}
</style>
