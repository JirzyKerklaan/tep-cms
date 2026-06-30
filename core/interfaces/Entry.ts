import { BaseEntity } from '@core/interfaces/BaseEntity';

export interface Entry extends BaseEntity {
    slug: string;
    content?: string;
    published_at?: Date;
    scheduled_at?: Date;
}
