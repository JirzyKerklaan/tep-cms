import collectionService from "@core/admin/services/collectionService";
import entryService from "@core/admin/services/entryService";
import { Entry } from "@core/interfaces/Entry";
import {ScheduledEntries} from "@core/interfaces/ScheduledEntries";

export async function getScheduled(): Promise<ScheduledEntries[]> {
    const collections = await collectionService.getAll();

    return Promise.all(
        collections.map(async (collection) => {
            const collectionEntries: Entry[] = await entryService.getAll(collection);

            const scheduledEntries = collectionEntries.filter(
                (entry) => entry.published_at === null && entry.scheduled_at !== null
            );

            return {
                name: collection,
                entries: scheduledEntries,
            };
        })
    );
}

export async function publishScheduled(entry: Entry, collectionName: string): Promise<void> {
    try {
        await entryService.edit(collectionName, {
            ...entry,
            published_at: new Date(),
        });
    } catch (err) {
        console.error(`Failed to publish entry "${entry.name}":`, err);
    }
}
