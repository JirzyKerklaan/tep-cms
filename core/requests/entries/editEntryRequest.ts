import { Entry } from "@core/interfaces/Entry";

export type EditEntryRequest = Entry & {
    collection: string;
};