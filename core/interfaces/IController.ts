import {Request, Response} from "express";

export interface IController {
    list?(req: Request, res: Response): Promise<void>;
    create?(req: Request, res: Response): Promise<void>;
    update?(req: Request, res: Response): Promise<void>;
    delete?(req: Request, res: Response): Promise<void>;
    newForm?(req: Request, res: Response): void;
    editForm?(req: Request, res: Response): Promise<void>;
}