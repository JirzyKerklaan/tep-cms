import {EntryHook} from "@core/interfaces/EntryHook";
import {CollectionHook} from "@core/interfaces/CollectionHook";

export interface Plugin {
    name: string;
    hooks?: {
        beforeCollectionCreate?: CollectionHook[];
        afterCollectionCreate?: CollectionHook[];
        beforeEntryCreate?: EntryHook[];
        afterEntryCreate?: EntryHook[];
    };
}