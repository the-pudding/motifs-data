<script>
	import { onMount } from "svelte";
	import WaveSurfer from "wavesurfer.js";
	import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

	let { src, name, motifs = $bindable() } = $props();

	const waveColor = "#CCBB44";
	const progressColor = "#EE6677";
	const regionColor = "rgba(52, 162, 158, 0.5)";
	const regionHighlightColor = "rgb(162, 57, 202, 0.75)";

	let container;
	let wavesurfer;
	let marking = $state(false);
	let destroying = $state(false);
	let regions = $state();
	let regionStart = $state();
	let selectedRegion = $state(null);
	let selectedMotif = $state();
	let inputNewMotifName = $state("");
	let inputNewMotifEmoji = $state("");
	let inputErrorMessage = $state("");

	const togglePlay = (e) => {
		if (wavesurfer) {
			wavesurfer.playPause();
		}
	};

	const createRegion = ({ id = "", start, end, content = "" }) => {
		const r = regions.addRegion({
			id,
			start,
			end,
			content,
			color: regionColor,
			drag: true,
			resize: true
		});
		r.on("click", (e) => onRegionClick(e, r.id));
		r.on("update-end", async () => {
			if (!r.content) return;

			for (const motif of motifs) {
				for (const region of motif.regions ?? []) {
					if (region.id === r.id) {
						region.start = r.start;
						region.end = r.end;
					}
				}
			}
			await save();
		});
		r.on("content-changed", async () => {
			const oldMotif = motifs.find((m) =>
				m.regions.some((region) => region.id === r.id)
			);
			const oldTrackName = oldMotif.regions.find(
				(region) => region.id === r.id
			)["track-name"];
			oldMotif.regions = oldMotif.regions.filter(
				(region) => region.id !== r.id
			);

			const newMotif = motifs.find(
				(m) => `${m.emoji} ${m.name}` === selectedMotif
			);
			newMotif.regions = [
				...newMotif.regions,
				{
					id: r.id,
					"track-name": oldTrackName,
					start: r.start,
					end: r.end
				}
			];

			await save();
		});

		return r;
	};

	const playRegion = (e) => {
		if (selectedRegion) {
			wavesurfer.play(selectedRegion.start, selectedRegion.end);
			wavesurfer.once("finish", () => {
				wavesurfer.pause();
			});
		}
	};

	const deleteRegion = async (e) => {
		if (!selectedRegion) return;

		if (selectedRegion.content) {
			for (const motif of motifs) {
				motif.regions = motif.regions?.filter(
					(region) => region.id !== selectedRegion.id
				);
			}
			await save();
		}

		selectedRegion.remove();
		selectedRegion = null;
	};

	const getRegionEl = async (id, timeout = 2000) => {
		const shadowHost = container.querySelector(".wavesurfer-host");
		const shadowRoot = shadowHost?.shadowRoot;

		if (!shadowRoot) {
			console.warn("❌ No shadowRoot found");
			return null;
		}

		const findEl = () =>
			Array.from(shadowRoot.querySelectorAll("*")).find((el) => {
				const part = el.getAttribute?.("part");
				return part?.split(" ").includes(id);
			});

		// Check if it's already rendered
		const existing = findEl();
		if (existing) return existing;

		// Otherwise, wait for it
		return new Promise((resolve, reject) => {
			const observer = new MutationObserver(() => {
				const match = findEl();
				if (match) {
					observer.disconnect();
					resolve(match);
				}
			});

			observer.observe(shadowRoot, { childList: true, subtree: true });

			setTimeout(() => {
				observer.disconnect();
				reject(
					new Error(`Region element with id "${id}" not found in ${timeout}ms`)
				);
			}, timeout);
		});
	};

	const onWindowClick = (e) => {
		const clickableTags = [
			"SELECT",
			"BUTTON",
			"A",
			"INPUT",
			"TEXTAREA",
			"LABEL"
		];

		if (
			clickableTags.includes(e.target.tagName) ||
			e.target.closest(
				'[role="button"], [role="menuitem"], .ignore-outside-click'
			)
		)
			return;

		selectedRegion = null;
	};

	const onRegionClick = (e, id) => {
		e.stopPropagation();
		selectedRegion = regions.regions.find((d) => d.id === id);
	};

	const onKeyDown = (e) => {
		const tag = document.activeElement.tagName;
		const isTyping =
			tag === "INPUT" ||
			tag === "TEXTAREA" ||
			document.activeElement.isContentEditable;
		if (isTyping) return;

		e.preventDefault();

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
					const r = createRegion({
						start: regionStart.start,
						end
					});
					selectedRegion = r;
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
		console.log("🔁 AudioPlayer running");
	});

	const save = async () => {
		const res = await fetch("/api/save-motifs", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(motifs)
		});

		const data = await res.json();
		if (data.success) {
			console.log("✅ Motifs saved!");
		} else {
			console.error("❌ Failed to save motifs:", data.error);
		}
	};

	const createMotif = async () => {
		if (inputNewMotifName.trim() === "" || inputNewMotifEmoji.trim() === "") {
			inputErrorMessage = "Enter a name and an emoji.";
			return;
		}

		inputErrorMessage = "";
		const motifName = inputNewMotifName.trim();
		const motifEmoji = inputNewMotifEmoji.trim() || "🎵";
		const newMotif = {
			name: motifName,
			emoji: motifEmoji,
			regions: [
				{
					id: selectedRegion.id,
					"track-name": name,
					start: selectedRegion.start,
					end: selectedRegion.end
				}
			]
		};

		motifs.push(newMotif);
		// motifs = motifs;
		selectedMotif = motifName;
		inputNewMotifName = "";
		inputNewMotifEmoji = "";

		await save();
	};

	const loadExistingRegions = () => {
		wavesurfer.once("ready", () => {
			regions.clearRegions();

			motifs.forEach((motif) => {
				motif.regions?.forEach((region) => {
					if (region["track-name"] === name) {
						createRegion({
							id: region.id,
							start: +region.start,
							end: +region.end,
							content: `${motif.emoji} ${motif.name}`
						});
					}
				});
			});
		});
	};

	const updateSrc = () => {
		if (!wavesurfer) return;
		wavesurfer.load(src);
		loadExistingRegions();
	};

	const regionSelectionChange = async () => {
		if (!wavesurfer || !regions) return;

		const allRegions = regions.regions;

		for (const r of allRegions) {
			const regionEl = await getRegionEl(r.id);
			if (regionEl) {
				if (selectedRegion && r.id === selectedRegion.id) {
					regionEl.style.background = regionHighlightColor;
				} else {
					regionEl.style.background = regionColor;
				}
			}
		}
	};

	const motifSelectedChange = () => {
		if (!wavesurfer || !selectedRegion || !selectedMotif) return;

		if (selectedRegion.content.innerHTML !== selectedMotif) {
			selectedRegion.setContent(selectedMotif);
		}
	};

	$effect(() => updateSrc(src));
	$effect(() => regionSelectionChange(selectedRegion));
	$effect(() => motifSelectedChange(selectedMotif));

	onMount(() => {
		regions = RegionsPlugin.create();

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
		loadExistingRegions();

		return () => {
			destroying = true;
			if (wavesurfer) wavesurfer.destroy();
		};
	});
</script>

<svelte:window on:keydown={onKeyDown} onclick={onWindowClick} />

<div class="player">
	<h2>{name}</h2>
	<div class="waveform" bind:this={container}></div>

	<div class="controls">
		<button onclick={togglePlay}>Play / Pause</button>

		{#if selectedRegion}
			<div class="region-controls">
				<span>Region</span>
				<button onclick={playRegion}>Play</button>
				<button onclick={deleteRegion}>Delete</button>
				<select bind:value={selectedMotif}>
					<option disabled selected value={undefined}>Select a motif</option>
					{#each motifs as motif}
						<option value={`${motif.emoji} ${motif.name}`}
							>{`${motif.emoji} ${motif.name}`}</option
						>
					{/each}
					<option value={"new"}>➕ Add new</option>
				</select>

				{#if selectedMotif === "new"}
					<div class="inputs">
						<input
							bind:value={inputNewMotifName}
							type="text"
							placeholder="New motif name"
						/>
						<input
							bind:value={inputNewMotifEmoji}
							type="text"
							placeholder="Emoji"
						/>
						<button onclick={createMotif}>Save</button>
						{#if inputErrorMessage}
							<span class="error">{inputErrorMessage}</span>
						{/if}
					</div>
				{/if}
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

	.region-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.inputs input:nth-of-type(2) {
		width: 65px;
	}

	.error {
		color: red;
	}

	:global(.wavesurfer-host::part(region-content)) {
		margin-top: 0;
		font-size: 12px;
	}
</style>
