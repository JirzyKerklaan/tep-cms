import {AuthRequest} from "@core/requests/routes/authRequest";

export type LoginRequest = Omit<AuthRequest, 'email'>;