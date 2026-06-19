import {BaseEntity} from "@core/interfaces/BaseEntity";
import {Block} from "@core/interfaces/Block";

export interface Collection extends BaseEntity {
    blocks: Block[]|string[],
}