import { BaseEntity } from '@core/interfaces/BaseEntity';
import {PageBuilderBlock} from "@core/interfaces/PageBuilderBlock";

export interface Entry extends BaseEntity {
    slug: string;
    content?: string;
    published_at?: Date;
    scheduled_at?: Date;
    page_builder?: PageBuilderBlock[];
}
