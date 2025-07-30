<script>
	// shadow, plain, line, bubble
	import wordmark from "$svg/logo-white.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html wordmark}</a
		>
	</div>
</header>

<style>
	header {
		position: absolute;
		top: 1em;
		left: 1em;
	}

	.wordmark {
		max-width: 3em;
		transform: rotate(-4deg);
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}
</style>
