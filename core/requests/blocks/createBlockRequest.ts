import {BlockType} from "@core/interfaces/types/BlockType";

export interface CreateBlockRequest {
    name: string;
    type: BlockType;
    fieldsJson: string;
}
