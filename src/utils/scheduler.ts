import cron from 'node-cron';
import { getScheduled, publishScheduled } from '../../core/services/schedulerService'

export async function startScheduler() {
    const scheduled = await getScheduled();
    console.log('scheduled: ', scheduled);

    cron.schedule('* * * * *', async () => {
        const now = new Date();

        // for (const schedule of scheduled) {
        //     if (schedule && schedule <= now) {
        //         await publishScheduled();
        //         console.log(schedule.name + ' has been published at ' + now)
        //     }
        // }
    })
}