<script>
	import WaveSurfer from "wavesurfer.js";
	import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

	const { src, name } = $props();

	const waveColor = "#CCBB44";
	const progressColor = "#EE6677";
	const regionColor = "rgba(52, 162, 158, 0.5)";
	const regionHighlightColor = "rgb(162, 57, 202, 0.75)";

	let container;
	let wavesurfer;
	let marking = $state(false);
	let regionStart = $state(null);
	let fullRegion = $state(null);
	let selectedRegion = $state(null);
	let regions = $state(RegionsPlugin.create());

	const togglePlay = (e) => {
		if (e) e.stopPropagation();
		if (wavesurfer) {
			wavesurfer.playPause();
		}
	};

	const regionPlay = (e) => {
		e.stopPropagation();
		if (selectedRegion) {
			wavesurfer.play(selectedRegion.start, selectedRegion.end);
			wavesurfer.once("finish", () => {
				wavesurfer.pause();
			});
		}
	};

	const regionDelete = (e) => {
		e.stopPropagation();
		if (selectedRegion) {
			selectedRegion.remove();
			selectedRegion = null;
		}
	};

	const getRegionEl = (id) => {
		const shadowHost = container.querySelector(".wavesurfer-host");
		const shadowRoot = shadowHost?.shadowRoot;
		return Array.from(shadowRoot?.querySelectorAll("*")).find(
			(el) =>
				el.getAttribute?.("part") &&
				el.getAttribute("part").split(" ").includes(id)
		);
	};

	const onWindowClick = (e) => {
		if (!selectedRegion) return;
		const regionEl = getRegionEl(selectedRegion.id);
		if (regionEl) regionEl.style.background = regionColor;
		selectedRegion = null;
	};

	const onRegionClick = (e, id) => {
		e.stopPropagation();

		if (selectedRegion) {
			const oldRegionEl = getRegionEl(selectedRegion.id);
			if (oldRegionEl) oldRegionEl.style.background = regionColor;
		}

		const newRegionEl = getRegionEl(id);
		if (newRegionEl) newRegionEl.style.background = regionHighlightColor;
		selectedRegion = regions.regions.find((d) => d.id === id);
	};

	const onKeyDown = (e) => {
		if (e.key === " ") {
			togglePlay();
		} else if (e.key === "m") {
			if (!marking) {
				const start = wavesurfer.getCurrentTime();
				regionStart = regions.addRegion({
					start,
					end: start + 0.1,
					color: regionColor,
					drag: false,
					resize: false
				});
				marking = true;
			} else {
				if (!regionStart) return;

				const end = wavesurfer.getCurrentTime();
				if (end > regionStart.start) {
					fullRegion = regions.addRegion({
						start: regionStart.start,
						end,
						color: regionColor,
						drag: true,
						resize: true
					});

					const r = fullRegion;
					r.on("click", (e) => onRegionClick(e, r.id));
				}

				regionStart.remove();
				marking = false;
				wavesurfer.pause();
			}
		} else if (e.key === "Escape" && marking) {
			if (regionStart) regionStart.remove();
			marking = false;
		}
	};

	$effect(() => {
		wavesurfer = WaveSurfer.create({
			container,
			waveColor: waveColor,
			progressColor: progressColor,
			height: "auto",
			dragToSeek: true,
			plugins: [regions]
		});

		setTimeout(() => {
			const shadowHost = container.querySelector("div");
			if (shadowHost && shadowHost.shadowRoot) {
				shadowHost.classList.add("wavesurfer-host");
			} else {
				console.warn("Could not find shadow host!");
			}
		}, 0);

		wavesurfer.load(src);

		return () => {
			if (wavesurfer) wavesurfer.destroy();
		};
	});
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} onclick={onWindowClick} />

<div class="player">
	<h2>{name}</h2>
	<div class="waveform" bind:this={container}></div>

	<div class="controls">
		<button onclick={togglePlay}>Play / Pause</button>

		{#if selectedRegion}
			<div class="region-controls">
				<span>Region</span>
				<button onclick={regionPlay}>Play</button>
				<button onclick={regionDelete}>Delete</button>
				<button onclick={regionRename}>Name</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.waveform {
		width: 100%;
		margin-bottom: 0.5rem;
	}

	.controls {
		display: flex;
		gap: 2rem;
	}

	:global(.wavesurfer-host::part(region)) {
	}
</style>
