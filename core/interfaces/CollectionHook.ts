import {Collection} from "@core/interfaces/Collection";

export type CollectionHook = (
    collection: Collection,
    data?: Partial<Collection>) => Promise<void> | void;