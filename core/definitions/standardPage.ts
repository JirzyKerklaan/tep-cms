import { Collection } from "@core/interfaces/Collection";

export default function standardPage(collection: Collection, uuid: string) {
    return {
        id: uuid,
        name: "Standaard",
        slug: "standard",
        content: "Welcome to the standard page. Customize this content as needed.",
        published_at: new Date().toISOString(),
        scheduled_at: "2025-10-01T10:00:00Z",
        page_builder: collection.blocks
    };
}