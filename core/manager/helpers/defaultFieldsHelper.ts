export function getDefaultFields(schemaFields: any[]) {
  const defaultData: Record<string, any> = {};

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
