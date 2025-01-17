<script lang="ts">
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Switch from "src/svelte/shared/components/switch.svelte";
	import {
		CheckboxFilterCondition,
		DateFilterCondition,
		FilterCondition,
		FilterOperator,
		ListFilterCondition,
		NumberFilterCondition,
		PropertyType,
		TextFilterCondition,
	} from "src/types";
	import { getDisplayNameForFilterCondition } from "./utils";
	import { getAllObsidianProperties } from "src/obsidian/utils";

	export let index: number;
	export let id: string;
	export let propertyName: string;
	export let type: PropertyType;
	export let operator: FilterOperator;
	export let value: string;
	export let condition: FilterCondition;
	export let isEnabled: boolean;
	export let matchWhenPropertyDNE: boolean;

	let plugin: VaultExplorerPlugin;
	let obsidianProperties: ObsidianProperty[] = [];

	store.plugin.subscribe((p) => {
		plugin = p;
		obsidianProperties = getAllObsidianProperties(plugin.app);
	});

	import { createEventDispatcher } from "svelte";
	import store from "src/svelte/shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import { ObsidianProperty } from "src/obsidian/types";
	import Wrap from "src/svelte/shared/components/wrap.svelte";

	const dispatch = createEventDispatcher();

	function handleDeleteClick() {
		dispatch("filterDeleteClick", { id });
	}

	function handlePropertyNameChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("filterPropertyNameChange", { id, name: value });
	}

	function handleTypeChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("filterTypeChange", { id, type: value });
	}

	function handleConditionChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		dispatch("filterConditionChange", { id, condition: value });
	}

	function handleValueChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("filterValueChange", { id, value });
	}

	function handleOperatorChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		dispatch("filterOperatorChange", { id, operator: value });
	}

	function handleMatchWhenDNEChange(e: Event) {
		const value = (e.target as HTMLInputElement).checked;
		dispatch("filterMatchWhenPropertyDNEChange", {
			id,
			matchWhenDNE: value,
		});
	}

	function handleToggle() {
		dispatch("filterToggle", { id });
	}

	$: filterConditions = findFilterConditions(type);

	$: filteredObsidianProperties = obsidianProperties.filter((prop) => {
		if (type === "list") {
			return (
				prop.type === "aliases" ||
				prop.type === "tags" ||
				prop.type === "multitext"
			);
		}
		return prop.type === type;
	});

	function findFilterConditions(type: PropertyType): FilterCondition[] {
		if (type === "text") {
			return Object.values(TextFilterCondition);
		} else if (type === "number") {
			return Object.values(NumberFilterCondition);
		} else if (type === "list") {
			return Object.values(ListFilterCondition);
		} else if (type === "checkbox") {
			return Object.values(CheckboxFilterCondition);
		} else if (type === "date" || type === "datetime") {
			return Object.values(DateFilterCondition);
		} else {
			throw new Error(`Unknown filter type: ${type}`);
		}
	}
</script>

<div class="vault-explorer-property-filter">
	<Wrap spacingX="sm" spacingY="sm" align="center">
		{#if index > 0}
			<select
				class="vault-explorer-property-filter__operator"
				value={operator}
				on:change={handleOperatorChange}
			>
				<option value="and">and</option>
				<option value="or">or</option>
			</select>
		{/if}
		<select value={type} on:change={handleTypeChange}>
			{#each Object.values(PropertyType) as type}
				<option value={type}>{type}</option>
			{/each}
		</select>
		<select value={propertyName} on:change={handlePropertyNameChange}>
			<option value="">Select a property</option>
			{#each filteredObsidianProperties as prop (prop.name)}
				<option value={prop.name}>{prop.name}</option>
			{/each}
		</select>
		<select value={condition} on:change={handleConditionChange}>
			{#each filterConditions as condition}
				<option value={condition}>
					{getDisplayNameForFilterCondition(condition)}
				</option>
			{/each}
		</select>
		{#if condition !== TextFilterCondition.EXISTS && condition !== TextFilterCondition.DOES_NOT_EXIST}
			<input type="text" {value} on:change={handleValueChange} />
		{/if}
		{#if condition !== TextFilterCondition.EXISTS && condition !== TextFilterCondition.DOES_NOT_EXIST}
			<input
				aria-label="Match when property doesn't exist"
				type="checkbox"
				checked={matchWhenPropertyDNE}
				on:change={handleMatchWhenDNEChange}
			/>
		{/if}
		<Stack spacing="sm" align="center">
			<Switch value={isEnabled} on:change={() => handleToggle()} />
			<IconButton
				ariaLabel="Delete property filter"
				iconId="trash"
				on:click={() => handleDeleteClick()}
			/>
		</Stack>
	</Wrap>
</div>

<style>
	.vault-explorer-property-filter__operator {
		width: 58px;
	}

	.vault-explorer-property-filter input {
		max-width: 125px;
	}

	.vault-explorer-property-filter select {
		max-width: 150px;
	}
</style>
