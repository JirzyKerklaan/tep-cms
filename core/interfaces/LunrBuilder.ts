import {IndexEntry} from "@core/interfaces/IndexEntry";

export interface LunrBuilder {
    ref(field: string): void;
    field(field: string, opts?: { boost?: number }): void;
    add(doc: IndexEntry): void;
}