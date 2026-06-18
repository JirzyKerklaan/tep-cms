export interface KeyValue {
    key: string;
    value: string | ((...args: string[]) => string);
}