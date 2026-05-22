"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultFields = getDefaultFields;
function getDefaultFields(schemaFields) {
    const defaultData = {};
    for (const field of schemaFields) {
        switch (field.type) {
            case 'text':
            case 'link':
            case 'asset':
                defaultData[field.name] = '';
                break;
            case 'repeater':
                defaultData[field.name] = [];
                break;
            default:
                defaultData[field.name] = null;
        }
    }
    return defaultData;
}
