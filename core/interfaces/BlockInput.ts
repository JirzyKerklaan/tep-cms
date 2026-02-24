import {BaseEntity} from "./BaseEntity";
import {BlockType} from "../manager/services/blockService";
import {Field} from "./Field";

export interface BlockInput extends BaseEntity {
    block: string;
    type: BlockType;
    fields: Field[];
}