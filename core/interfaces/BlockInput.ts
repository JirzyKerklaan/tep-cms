import {BaseEntity} from "@core/interfaces/BaseEntity";
import {BlockType} from "@core/admin/services/blockService";
import {Field} from "@core/interfaces/Field";

export interface BlockInput extends BaseEntity {
    block: string;
    type: BlockType;
    fields: Field[];
}