import {FieldValue} from "@core/interfaces/types/FieldValue";

export interface PageBuilderBlock {
    block: string,
    fields: Record<string, FieldValue>;
}