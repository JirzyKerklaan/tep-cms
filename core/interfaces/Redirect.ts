import {BaseEntity} from "./BaseEntity";

export interface Redirect extends BaseEntity {
    from: string;
    to: string;
    permanent?: boolean;
}