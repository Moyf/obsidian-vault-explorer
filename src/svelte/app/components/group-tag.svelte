<script lang="ts">
	export let id: string;
	export let name: string;
	export let isSelected: boolean;

	$: className =
		"vault-explorer-group-tag" +
		(isSelected ? " vault-explorer-group-tag--active" : "");

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("groupClick", { id });
	}

	function handleDragStart(event: Event) {
		dispatch("groupDragStart", { nativeEvent: event, id });
	}

	function handleDragOver(event: Event) {
		dispatch("groupDragOver", { nativeEvent: event, id });
	}

	function handleDrop(event: Event) {
		dispatch("groupDrop", { nativeEvent: event, id });
	}
</script>

<div
	tabindex="0"
	role="button"
	draggable="true"
	class={className}
	on:dragstart={handleDragStart}
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:click={handleClick}
	on:keydown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
>
	{name}
</div>

<style>
	.vault-explorer-group-tag {
		white-space: nowrap;
		font-size: var(--tag-size);
		font-weight: var(--tag-weight);
		text-decoration: var(--tag-decoration);
		padding: var(--tag-padding-y) var(--tag-padding-x);
		line-height: 1;
		border-radius: var(--tag-radius);

		color: var(--text-faint);
		border: 1px solid var(--background-modifier-border);
		background-color: var(--background-primary);
	}

	.vault-explorer-group-tag:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}

	.vault-explorer-group-tag--active {
		background-color: var(--tag-background);
		border: 1px solid var(--tag-border-color);
		color: var(--tag-color);
	}
</style>
