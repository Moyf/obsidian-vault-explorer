export interface VaultExplorerPluginSettings_0_3_3 {
	properties: {
		favorite: string;
		url: string;
		custom1: string;
		custom2: string;
		custom3: string;
	},
	filters: {
		folder: string;
		search: string;
		onlyFavorites: boolean;
		sort: SortFilter;
		timestamp: TimestampFilter;
		properties: {
			selectedGroupId: string;
			groups: PropertyFilterGroup[];
		}
	},
	currentView: CurrentView;
	pageSize: number;
	pluginVersion: string | null;
}

interface TextPropertyFilter extends BasePropertyFilter {
	condition: TextFilterCondition;
	value: string;
}

type PropertyFilter = TextPropertyFilter;

interface PropertyFilterGroup {
	id: string;
	name: string;
	filters: PropertyFilter[];
	position: number;
	isEnabled: boolean;
}

interface BasePropertyFilter {
	id: string;
	propertyName: string;
	operator: FilterOperator;
	isEnabled: boolean;
}

enum TextFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

type FilterOperator = "and" | "or";

type CurrentView = "grid" | "list";

type SortFilter = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

type TimestampFilter = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";
