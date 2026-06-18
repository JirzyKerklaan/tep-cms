import {BaseEntity} from "@core/interfaces/BaseEntity";

export interface Collection extends BaseEntity {
    blocks: string | string[],
}