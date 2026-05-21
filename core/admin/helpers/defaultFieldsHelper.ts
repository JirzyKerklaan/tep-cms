import {Field} from "../../interfaces/Field";

export function getDefaultFields(schemaFields: Field[]): Record<string, string | unknown[] | null> {
  const defaultData: Record<string, string | unknown[] | null> = {};


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
