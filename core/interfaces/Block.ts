import { BaseEntity } from '@core/interfaces/BaseEntity';
import {Field} from "@core/interfaces/Field";
import {BlockType} from "@core/interfaces/BlockType";

export interface Block extends BaseEntity {
    block: string;
    type: BlockType;
    fields: Field[];
}
