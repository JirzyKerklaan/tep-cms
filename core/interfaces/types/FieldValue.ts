import {Image} from "@core/interfaces/Image";

export type FieldValue =
    | string
    | number
    | boolean
    | null
    | Record<string, unknown>
    | FieldValue[]
    | Image
