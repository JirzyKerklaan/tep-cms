export interface NavLink {
    label: string;
    url: string;
    links?: NavLink[];
}