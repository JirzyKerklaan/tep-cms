import {KeyValue} from "@core/interfaces/KeyValue";

const routes: Record<string, KeyValue> = {

    // Admin - General
    'admin.dashboard': {
        key: 'admin.dashboard',
        value: '/admin',
    },
    'admin.login': {
        key: 'admin.login',
        value: '/admin/login',
    },
    'admin.register': {
        key: 'admin.register',
        value: '/admin/register',
    },

    // Admin - Collections
    'admin.collections': {
        key: 'admin.collections',
        value: '/admin/collections',
    },
    'admin.collections.create': {
        key: 'admin.collections.create',
        value: '/admin/collections/create',
    },
    'admin.collections.view': {
        key: 'admin.collections.view',
        value: (collection: string) => `/admin/collections/${collection}`,
    },
    'admin.collections.edit': {
        key: 'admin.collections.edit',
        value: (collection: string) => `/admin/collections/${collection}/edit`,
    },
    'admin.collections.delete': {
        key: 'admin.collections.edit',
        value: (collection: string) => `/admin/collections/${collection}/delete`,
    },

    // Admin - Entries
    'admin.entries': {
        key: 'admin.entries',
        value: (collection: string) => `/admin/collections/${collection}`,
    },
    'admin.entries.create': {
        key: 'admin.entries.create',
        value: (collection: string) => `/admin/collections/${collection}/create`,
    },
    'admin.entries.view': {
        key: 'admin.entries.view',
        value: (collection: string, entry: string) => `/admin/collections/${collection}/${entry}`,
    },
    'admin.entries.edit': {
        key: 'admin.entries.edit',
        value: (collection: string, entry: string) => `/admin/collections/${collection}/${entry}/edit`,
    },
    'admin.entries.delete': {
        key: 'admin.entries.delete',
        value: (collection: string, entry: string) => `/admin/collections/${collection}/${entry}/delete`,
    },

    // Admin - Blocks
    'admin.blocks': {
        key: 'admin.blocks',
        value: '/admin/blocks'
    },
    'admin.blocks.create': {
        key: 'admin.blocks.create',
        value: '/admin/blocks/create'
    },
    'admin.blocks.edit': {
        key: 'admin.blocks.edit',
        value: (block: string) => `/admin/blocks/${block}/edit`
    },
    'admin.blocks.delete': {
        key: 'admin.blocks.delete',
        value: (block: string) => `/admin/blocks/${block}/delete`
    },
};

export function route(
    name: keyof typeof routes,
    ...params: string[]
): string {
    const r = routes[name] as KeyValue

    if (typeof r.value === 'function') {
        return r.value(...params);
    }

    return r.value;
}