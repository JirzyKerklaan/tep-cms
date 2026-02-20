import {BaseEntity} from "./BaseEntity";

export interface Field extends BaseEntity {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    defaultValue?: unknown;
}