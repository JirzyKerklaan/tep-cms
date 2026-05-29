import {BaseEntity} from "@core/interfaces/BaseEntity";

export interface Field extends BaseEntity {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    defaultValue?: unknown;
}