import {NavigationGroup} from "@core/interfaces/NavGroup";

declare global {
    namespace Express {
        interface Request {
            body: {
                [key: string]: unknown;
                validated?: (field?: string) => unknown;
            };
        }

        interface Locals {
            navigation: Record<string, NavigationGroup>;
        }
    }
}

export {}