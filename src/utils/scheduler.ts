import cron from 'node-cron';
import { getScheduled, publishScheduled } from '../../core/services/schedulerService'

export async function startScheduler() {
    cron.schedule('* * * * *', async () => {
        const scheduledCollections = await getScheduled();
        const now = new Date();

        for (const collection of scheduledCollections) {
            if (!collection.entries.length) continue;

            for (const entry of collection.entries) {
                if (!entry.scheduled_at) continue; // skip if scheduled_at is null

                const scheduledDate = new Date(entry.scheduled_at);
                if (scheduledDate <= now && entry.published_at === null) {
                    await publishScheduled(entry, collection.name);
                }
            }
        }
    });
}
