<script>
	let { motifs = $bindable(), savedMessage } = $props();

	let sortedMotifs = $derived(
		[...motifs].sort((a, b) => b.regions.length - a.regions.length)
	);
</script>

<div class="motifs">
	<div class="title">
		<h3>Motifs ({motifs.length})</h3>
		<span class:visible={savedMessage !== ""}>{savedMessage}</span>
	</div>

	{#if sortedMotifs && sortedMotifs.length > 0}
		<ul>
			{#each sortedMotifs.filter((m) => m.regions.length > 0) as motif}
				{@const numOccurences = motif.regions.length}
				<li>
					<div class="name">{motif.emoji} {motif.name} ({numOccurences})</div>
					<div class="regions">
						{#each motif.regions as region}
							<div class="region">
								<span
									>{region["track-name"]} ({(region.end - region.start).toFixed(
										0
									)}s)</span
								>
							</div>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No motifs.</p>
	{/if}
</div>

<style>
	.motifs {
		width: 400px;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
		position: relative;
	}

	.title span {
		font-size: 10px;
		position: absolute;
		top: 0;
		transform: translate(0, -100%);
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	.title span.visible {
		opacity: 1;
	}

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: scroll;
	}

	li {
		border-radius: 5px;
		padding: 0.5rem;
		border: var(--color-gray-400) 1px solid;
	}

	.name {
		font-size: 20px;
		white-space: nowrap;
		margin-bottom: 0.5rem;
	}

	.regions {
		display: flex;
		gap: 0.5rem;
		overflow: scroll;
	}

	.region {
		color: var(--color-gray-300);
		font-size: 14px;
		border-radius: 5px;
		border: var(--color-gray-600) 1px solid;
		padding: 0.25rem;
	}
</style>
