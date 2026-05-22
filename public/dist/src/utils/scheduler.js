"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const schedulerService_1 = require("../../core/services/schedulerService");
async function startScheduler() {
    node_cron_1.default.schedule('* * * * *', async () => {
        const scheduledCollections = await (0, schedulerService_1.getScheduled)();
        const now = new Date();
        for (const collection of scheduledCollections) {
            if (!collection.entries.length)
                continue;
            for (const entry of collection.entries) {
                if (!entry.scheduled_at)
                    continue;
                const scheduledDate = new Date(entry.scheduled_at);
                if (scheduledDate <= now && entry.published_at === null) {
                    await (0, schedulerService_1.publishScheduled)(entry, collection.name);
                }
            }
        }
    });
}
