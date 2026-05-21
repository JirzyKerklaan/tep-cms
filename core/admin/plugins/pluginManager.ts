// pluginManager.ts
import {Entry} from "../../interfaces/Entry";
import {Plugin} from "../../interfaces/Plugin";

class PluginManager {
    private plugins: Plugin[] = [];

    register(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    async trigger(hookName: keyof NonNullable<Plugin['hooks']>, collection: string, entry: Entry, data?: Partial<Entry>) {
        for (const plugin of this.plugins) {
            const hooks = plugin.hooks?.[hookName] ?? [];
            if (hooks) {
                for (const hook of hooks) {
                    await hook(collection, entry, data);
                }
            }
        }
    }
}

export default new PluginManager();
