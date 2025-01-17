import { App, PluginSettingTab, Setting } from "obsidian";
import VaultExplorerPlugin from "src/main";
import { getDropdownOptionsForProperties, getObsidianPropertiesByType } from "./utils";
import { LOG_LEVEL_DEBUG, LOG_LEVEL_ERROR, LOG_LEVEL_INFO, LOG_LEVEL_OFF, LOG_LEVEL_TRACE, LOG_LEVEL_WARN } from "src/logger/constants";
import Logger from "js-logger";
import { stringToLogLevel } from "src/logger";
import { WordBreak } from "src/types";
import EventManager from "src/event/event-manager";

export default class VaultExplorerSettingsTab extends PluginSettingTab {
	plugin: VaultExplorerPlugin;

	constructor(app: App, plugin: VaultExplorerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const textProperties = getObsidianPropertiesByType(this.app, "text");
		const dateProperties = getObsidianPropertiesByType(this.app, "date");
		const dateTimeProperties = getObsidianPropertiesByType(this.app, "datetime");
		const checkboxProperties = getObsidianPropertiesByType(this.app, "checkbox");

		new Setting(containerEl).setName("Views").setHeading();

		new Setting(containerEl).setName("Page size").setDesc("The number of items to display per page.").addDropdown(dropdown => dropdown
			.addOptions({
				"10": "10",
				"25": "25",
				"50": "50",
				"100": "100",
				"250": "250",
				"500": "500",
			})
			.setValue(this.plugin.settings.pageSize.toString())
			.onChange(async (value) => {
				this.plugin.settings.pageSize = parseInt(value);
				await this.plugin.saveSettings();
				EventManager.getInstance().emit("page-size-setting-change");
			}));
		new Setting(containerEl)
			.setName("Title wrapping")
			.setDesc(
				"Sets the wrapping style for the title."
			)
			.addDropdown((cb) => {
				cb.addOptions({
					"normal": "Normal",
					"break-word": "Break Word",
				})
				cb.setValue(this.plugin.settings.views.titleWrapping).onChange(
					async (value) => {
						this.plugin.settings.views.titleWrapping = value as WordBreak;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit("title-wrapping-setting-change");
					}
				);
			});

		new Setting(containerEl).setName("Built-in properties").setHeading();

		new Setting(containerEl)
			.setName('Favorite property')
			.setDesc('The property used to mark a note as a favorite. This must be a checkbox property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(checkboxProperties))
				.setValue(this.plugin.settings.properties.favorite)
				.onChange(async (value) => {
					this.plugin.settings.properties.favorite = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit("property-setting-change");
				}));

		new Setting(containerEl)
			.setName('URL property')
			.setDesc('The property used to store the URL of the content. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.url)
				.onChange(async (value) => {
					this.plugin.settings.properties.url = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit("property-setting-change");
				}));

		const createdDateDesc = new DocumentFragment();
		createdDateDesc.createDiv({
			text: "The property containing the creation date. This must be a date or datetime property.",
		});
		createdDateDesc.createDiv({
			text: "If set to 'Select a property', the file's created at date will be used.",
		});


		new Setting(containerEl)
			.setName("Created date property")
			.setDesc(createdDateDesc)
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties([...dateProperties, ...dateTimeProperties]))
				.setValue(this.plugin.settings.properties.createdDate)
				.onChange(async (value) => {
					this.plugin.settings.properties.createdDate = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit("property-setting-change");
				}));

		const modifiedDateDesc = new DocumentFragment();
		modifiedDateDesc.createDiv({
			text: "The property containing the modification date. This must be a date or datetime property.",
		});
		modifiedDateDesc.createDiv({
			text: "If set to 'Select a property', the file's modified at date will be used.",
		});

		new Setting(containerEl)
			.setName('Modified date property')
			.setDesc(modifiedDateDesc)
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties([...dateProperties, ...dateTimeProperties]))
				.setValue(this.plugin.settings.properties.modifiedDate)
				.onChange(async (value) => {
					this.plugin.settings.properties.modifiedDate = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit("property-setting-change");
				}));

		new Setting(containerEl).setName("Custom properties").setHeading();

		new Setting(containerEl)
			.setName('Custom property 1')
			.setDesc('The first custom property. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.custom1)
				.onChange(async (value) => {
					this.plugin.settings.properties.custom1 = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit("property-setting-change");
				}));

		new Setting(containerEl)
			.setName('Custom property 2')
			.setDesc('The second custom property. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.custom2)
				.onChange(async (value) => {
					this.plugin.settings.properties.custom2 = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit("property-setting-change");
				}));

		new Setting(containerEl)
			.setName('Custom property 3')
			.setDesc('The third custom property. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.custom3)
				.onChange(async (value) => {
					this.plugin.settings.properties.custom3 = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit("property-setting-change");
				}));

		new Setting(containerEl).setName("Debugging").setHeading();
		new Setting(containerEl)
			.setName("Log level")
			.setDesc(
				"Sets the log level. Please use trace to see all log messages."
			)
			.addDropdown((cb) => {
				cb.addOptions({
					[LOG_LEVEL_OFF]: "Off",
					[LOG_LEVEL_ERROR]: "Error",
					[LOG_LEVEL_WARN]: "Warn",
					[LOG_LEVEL_INFO]: "Info",
					[LOG_LEVEL_DEBUG]: "Debug",
					[LOG_LEVEL_TRACE]: "Trace"
				})
				cb.setValue(this.plugin.settings.logLevel).onChange(
					async (value) => {
						this.plugin.settings.logLevel = value;
						await this.plugin.saveSettings();
						Logger.setLevel(stringToLogLevel(value));
					}
				);
			});

	}
}
