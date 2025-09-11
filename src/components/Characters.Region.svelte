<script>
	import Clip from "$components/Clip.svelte";
	import _ from "lodash";

	let {
		motifs = $bindable(),
		region,
		musicalId,
		motifName,
		characterOptions = []
	} = $props();

	let clipPlaying = $state(false);
	let selectedCharacters = $state(region.character || []);
	let newCharacter = $state("");
	let savedMessage = $state("");
	let tempCharacterOptions = $state(characterOptions);
	let tempStart = $state(region.start);
	let tempEnd = $state(region.end);

	const addCharacter = () => {
		tempCharacterOptions = [...tempCharacterOptions, newCharacter];
		newCharacter = "";
	};

	const reset = () => {
		tempStart = region.start;
		tempEnd = region.end;
		selectedCharacters = region.character || [];
	};

	const save = async () => {
		const updatedMotifs = motifs.map((motif) => {
			if (motif.name === motifName) {
				return {
					...motif,
					regions: motif.regions.map((r) => {
						if (r.id === region.id) {
							return {
								...r,
								start: tempStart,
								end: tempEnd,
								character: selectedCharacters
							};
						}
						return r;
					})
				};
			}
			return motif;
		});

		motifs = updatedMotifs;

		const res = await fetch("/api/save-motifs", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ musicalId, motifs: updatedMotifs })
		});
		const data = await res.json();
		if (data.success) {
			savedMessage = "✅ Saved successfully!";
			setTimeout(() => {
				savedMessage = "";
			}, 3000);
		} else {
			console.error("❌ Failed to save motifs:", data.error);
			savedMessage = "❌ Failed to save motifs";
		}
	};
</script>

<div class="region" class:charactered={region.character}>
	<button class="reset" onclick={reset}>reset</button>

	<strong>Play</strong>
	<Clip
		id={region.id}
		trackName={region["track-name"]}
		src={`assets/audio/${musicalId}/${region["track-name"]}.mp3`}
		start={tempStart}
		end={tempEnd}
		bind:clipPlaying
	/>

	<div class="times">
		<strong>Timing</strong>
		<div>
			start: <span class:changed={tempStart !== region.start}
				>{tempStart.toFixed(1)}s</span
			>
		</div>
		<button class="adjust" onclick={() => (tempStart += 1)}>+1</button>
		<button class="adjust" onclick={() => (tempStart -= 1)}>-1</button>
		<button class="adjust" onclick={() => (tempStart += 0.1)}>+0.1</button>
		<button class="adjust" onclick={() => (tempStart -= 0.1)}>-0.1</button>

		<div>
			end: <span class:changed={tempEnd !== region.end}
				>{tempEnd.toFixed(1)}s</span
			>
		</div>
		<button class="adjust" onclick={() => (tempEnd += 1)}>+1</button>
		<button class="adjust" onclick={() => (tempEnd -= 1)}>-1</button>
		<button class="adjust" onclick={() => (tempEnd += 0.1)}>+0.1</button>
		<button class="adjust" onclick={() => (tempEnd -= 0.1)}>-0.1</button>
	</div>

	<label for="character"><strong>Select character(s):</strong></label>
	<select
		id="character"
		name="character"
		multiple
		bind:value={selectedCharacters}
	>
		{#each tempCharacterOptions as option}
			<option value={option} selected={region.character === option}
				>{option}</option
			>
		{/each}
	</select>

	<div>
		<input type="text" bind:value={newCharacter} placeholder="new character" />
		<button onclick={addCharacter}>add</button>
	</div>

	<div style="margin-top: 1rem">
		<button class="save" onclick={save}>Save</button>
		<span>{savedMessage}</span>
	</div>
</div>

<style>
	.region {
		position: relative;
		display: flex;
		flex-direction: column;
		border: 2px solid var(--color-gray-500);
		padding: 0.75rem;
	}

	.region.changes {
		border: 2px solid var(--color-yellow);
	}

	.region.charactered {
		border: 2px solid var(--color-green);
	}

	select {
		background-image: none;
		background: var(--color-white);
	}

	strong {
		text-decoration: underline;
	}

	.times,
	label {
		margin-top: 1rem;
	}

	input {
		margin-top: 0.5rem;
	}

	.changed {
		color: var(--color-green);
	}

	button.adjust {
		font-size: 12px;
	}

	button.reset {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
