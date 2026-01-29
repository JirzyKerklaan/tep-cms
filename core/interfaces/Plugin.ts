import {Entry} from "./Entry";

type EntryHook = (
    collection: string,
    entry: Entry,
    data?: Partial<Entry>) => Promise<void> | void;

export interface Plugin {
    name: string;
    hooks?: {
        beforeEntryCreate?: EntryHook[];
        afterEntryCreate?: EntryHook[];
    };
}