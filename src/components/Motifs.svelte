<script>
	let { motifs = $bindable() } = $props();
</script>

<div class="motifs">
	<div class="title">
		<h2>Motifs</h2>
	</div>

	{#if motifs && motifs.length > 0}
		<ul>
			{#each motifs.filter((m) => m.regions.length > 0) as motif}
				<li>
					<div class="name">{motif.emoji} {motif.name}</div>
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
	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
	}

	.region {
		color: var(--color-gray-300);
		font-size: 14px;
		border-radius: 5px;
		border: var(--color-gray-600) 1px solid;
		padding: 0.25rem;
	}

	.motifs {
		flex: 1;
	}
</style>
