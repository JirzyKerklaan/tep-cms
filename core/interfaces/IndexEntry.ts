import {BaseEntity} from "@core/interfaces/BaseEntity";

export interface IndexEntry extends BaseEntity {
    slug: string;
    content: string;
    type: string;
    path: string;
}