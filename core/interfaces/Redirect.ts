import {BaseEntity} from "@core/interfaces/BaseEntity";

export interface Redirect extends BaseEntity {
    from: string;
    to: string;
    permanent?: boolean;
}