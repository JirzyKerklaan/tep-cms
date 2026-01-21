import collectionService from "../manager/services/collectionService";
import entryService from "../manager/services/entryService";
import { Entry } from "../interfaces/Entry";

export async function getScheduled() {
    const collections = await collectionService.getAllWithEntryCount();

    return Promise.all(
        collections.map(async (collection) => {
            const collectionEntries: Entry[] = await entryService.getAllFromCollection(collection.name);

            const scheduledEntries = collectionEntries.filter(
                (entry) => entry.published_at === null && entry.scheduled_at !== null
            );

            return {
                name: collection.name,
                count: scheduledEntries.length,
                entries: scheduledEntries,
            };
        })
    );
}

export async function publishScheduled(entry: Entry, collectionName: string): Promise<void> {
    try {
        const now = new Date();
        await entryService.cronUpdate(collectionName, entry.slug, { published_at: now });
    } catch (err) {
        console.error(`Failed to publish entry "${entry.title}":`, err);
    }
}
