<script>
	let { motifs = $bindable() } = $props();

	const save = async () => {
		const res = await fetch("/api/save-motifs", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(motifs)
		});

		const data = await res.json();
		// TODO: show this on the screen
		// TODO: automatic save on change?
		if (data.success) {
			console.log("✅ Motifs saved!");
		} else {
			console.error("❌ Failed to save motifs:", data.error);
		}
	};
</script>

<div class="motifs">
	<div class="title">
		<h2>Motifs</h2>
		<button onclick={save}>Save 💾</button>
	</div>

	{#if motifs && motifs.length > 0}
		<ul>
			{#each motifs as motif}
				<li>
					<h3>{motif.emoji} {motif.name}</h3>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No motifs.</p>
	{/if}
</div>

<style>
	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	ul {
		list-style: none;
		padding: 0;
	}
	.motifs {
		flex: 1;
	}
</style>
