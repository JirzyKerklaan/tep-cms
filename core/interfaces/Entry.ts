import { BaseEntity } from './BaseEntity';

export interface Entry extends BaseEntity {
    title: string;
    slug: string;
    content?: string;
    published_at?: Date;
    scheduled_at?: Date;
    [key: string]: string | Date | number | undefined;
}
