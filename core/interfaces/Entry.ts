import { BaseEntity } from '@core/interfaces/BaseEntity';

export interface Entry extends BaseEntity {
    name: string;
    slug: string;
    content?: string;
    published_at?: Date;
    scheduled_at?: Date;
    [key: string]: string | Date | number | undefined;
}
