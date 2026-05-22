"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = route;
const routes = {
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
    'admin.collections.new': {
        key: 'admin.collections.new',
        value: '/admin/collections/new',
    },
    'admin.collections.edit': {
        key: 'admin.collections.edit',
        value: (id) => `/admin/collections/edit/${id}`,
    },
    'admin.entries': {
        key: 'admin.entries',
        value: (collection) => `/admin/collections/${collection}`,
    },
    'admin.entries.new': {
        key: 'admin.entries.new',
        value: (collection) => `/admin/collections/${collection}/new`,
    },
    'admin.entries.edit': {
        key: 'admin.entries.edit',
        value: (collection, id) => `/admin/collections/${collection}/edit/${id}`,
    },
    'admin.blocks': {
        key: 'admin.entries',
        value: '/admin/blocks',
    },
    'admin.blocks.new': {
        key: 'admin.entries.new',
        value: '/admin/blocks/new',
    },
    'admin.blocks.edit': {
        key: 'admin.blocks.edit',
        value: (id) => `/admin/blocks/edit/${id}`,
    },
};
function route(name, ...params) {
    const r = routes[name];
    if (typeof r.value === 'function') {
        return r.value(...params);
    }
    return r.value;
}
