import {BlockType} from "@core/interfaces/types/BlockType";
import {BaseEntity} from "@core/interfaces/BaseEntity";

export interface EditBlockRequest extends BaseEntity {
    name: string;
    type: BlockType;
    fieldsJson: string;
}