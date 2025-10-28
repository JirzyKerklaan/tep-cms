import {BaseEntity} from "./BaseEntity";
import {BlockType} from "../manager/services/blockService";

export interface BlockInput extends BaseEntity {
    block: string;
    type: BlockType;
    fields: any[];
}