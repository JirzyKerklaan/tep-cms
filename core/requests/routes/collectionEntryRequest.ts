import {EntryRequest} from "@core/requests/routes/entryRequest";

export interface CollectionEntryRequest extends EntryRequest {
    collection: string,
}