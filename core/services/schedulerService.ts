import collectionService from "../manager/services/collectionService";

export async function getScheduled() {
    const collections = await collectionService.getAll();

    // TODO: Currently only fetches the folders, not the json inside it (using an entryservice?)

    console.log(collections);
    return collections;
}

export function publishScheduled() {
    return;
}