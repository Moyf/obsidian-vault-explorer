import { LOG_LEVEL_WARN } from "./logger/constants";
import { generateUUID } from "./svelte/shared/services/uuid";
import { VaultExplorerPluginSettings, ViewType } from "./types";

export const VAULT_EXPLORER_VIEW = "vault-explorer";

export const HOVER_LINK_SOURCE_ID = "vault-explorer-preview";

const groupUUID = generateUUID();

export const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
	logLevel: LOG_LEVEL_WARN,
	properties: {
		favorite: "",
		url: "",
		createdDate: "",
		modifiedDate: "",
		custom1: "",
		custom2: "",
		custom3: "",
	},
	filters: {
		folder: "/",
		search: "",
		onlyFavorites: false,
		timestamp: "all",
		sort: "file-name-asc",
		properties: {
			selectedGroupId: groupUUID,
			groups:
				[
					{
						id: groupUUID,
						name: "Group 1",
						filters: [],
						isEnabled: true
					}
				]
		}
	},
	views: {
		currentView: ViewType.GRID,
		order: [ViewType.GRID, ViewType.LIST],
		titleWrapping: "normal"
	},
	pageSize: 50,
	pluginVersion: null
}
