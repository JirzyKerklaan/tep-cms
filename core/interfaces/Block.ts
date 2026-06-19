import { BaseEntity } from '@core/interfaces/BaseEntity';
import {Field} from "@core/interfaces/Field";
import {BlockType} from "@core/interfaces/types/BlockType";

export interface Block extends BaseEntity {
    type: BlockType;
    fields: Field[];
}
