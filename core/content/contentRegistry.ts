import collectionService from "@core/admin/services/collectionService";
import entryService from "@core/admin/services/entryService";

class ContentRegistry {
    private idToSlug = new Map<string, string>();
    private slugToId = new Map<string, string>();

    async build() {
        const collections = await collectionService.getAll();

        for (const collection of collections) {
            const entries = await entryService.getAll(collection)

            for (const entry of entries) {
                this.idToSlug.set(entry.id, entry.slug)
                this.slugToId.set(entry.slug, entry.id)
            }
        }
    }

    set(id: string, slug: string) {
        this.idToSlug.set(id, slug);
    }

    getById(id: string): string | undefined {
        return this.idToSlug.get(id);
    }
    getBySlug(slug: string): string | undefined {
        return this.slugToId.get(slug);
    }

    // TODO: Add delete method
}

export const contentRegistry = new ContentRegistry();