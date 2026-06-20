class ContentRegistry {
    private idToSlug = new Map<string, string>();

    set(id: string, slug: string) {
        this.idToSlug.set(id, slug);
    }

    getSlug(id: string): string | undefined {
        return this.idToSlug.get(id);
    }

    // TODO: Add delete method
}

export const contentRegistry = new ContentRegistry();