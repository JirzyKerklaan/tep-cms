"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScheduled = getScheduled;
exports.publishScheduled = publishScheduled;
const collectionService_1 = __importDefault(require("../admin/services/collectionService"));
const entryService_1 = __importDefault(require("../admin/services/entryService"));
async function getScheduled() {
    const collections = await collectionService_1.default.getAllWithEntryCount();
    return Promise.all(collections.map(async (collection) => {
        const collectionEntries = await entryService_1.default.getAllFromCollection(collection.name);
        const scheduledEntries = collectionEntries.filter((entry) => entry.published_at === null && entry.scheduled_at !== null);
        return {
            name: collection.name,
            count: scheduledEntries.length,
            entries: scheduledEntries,
        };
    }));
}
async function publishScheduled(entry, collectionName) {
    try {
        const now = new Date();
        await entryService_1.default.cronUpdate(collectionName, entry.slug, { published_at: now });
    }
    catch (err) {
        console.error(`Failed to publish entry "${entry.title}":`, err);
    }
}
