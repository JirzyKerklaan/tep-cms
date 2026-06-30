export interface Field {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    defaultValue?: unknown;
}