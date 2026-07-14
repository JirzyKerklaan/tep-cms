import {Entry} from "@core/interfaces/Entry";

export type EntryHook = (
    collection: string,
    entry: Entry,
    data?: Partial<Entry>) => Promise<void> | void;