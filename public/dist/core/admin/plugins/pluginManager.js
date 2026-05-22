"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PluginManager {
    constructor() {
        this.plugins = [];
    }
    register(plugin) {
        this.plugins.push(plugin);
    }
    async trigger(hookName, collection, entry, data) {
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
exports.default = new PluginManager();
