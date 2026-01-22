import {BaseEntity} from "./BaseEntity";

export interface Redirect extends BaseEntity {
    oldSlug: string;
    newSlug: string;
    type: number; // 301 (permanent) OR 302 (temporary)
}