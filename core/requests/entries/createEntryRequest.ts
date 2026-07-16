import {Entry} from "@core/interfaces/Entry";

export type CreateEntryRequest = Omit<Entry, 'id'> & {
    collection: string;
};