import { BaseEntity } from './BaseEntity';

export interface Entry extends BaseEntity {
    title: string;
    content?: string;
    published_at: Date | null;
    scheduled_at: string | null;
    [key: string]: any;
}
