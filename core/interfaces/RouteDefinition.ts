export interface RouteDefinition {
    key: string;
    value: string | ((...args: string[]) => string);
}