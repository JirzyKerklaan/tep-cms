import {Collection} from "@core/interfaces/Collection";

export type CreateCollectionRequest = Omit<Collection, 'id' | 'slug'>;