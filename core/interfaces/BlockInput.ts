import {BaseEntity} from "./BaseEntity";
import {BlockType} from "../admin/services/blockService";
import {Field} from "./Field";

export interface BlockInput extends BaseEntity {
    block: string;
    type: BlockType;
    fields: Field[];
}