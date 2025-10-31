import { BaseEntity } from './BaseEntity';

export interface Entry extends BaseEntity {
    title: string;
    slug: string;
    content?: string;
    published_at: Date | null;
    scheduled_at: Date | null;
    [key: string]: any;
}
