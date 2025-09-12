// src/requests/PostRequest.ts
import { BaseRequest } from "./request";

export class PostRequest extends BaseRequest {
    rules() {
        return {
            title: 'required|string|min:3',
            age: 'required|number|min:18',
            email: 'required|email',
        };
    }

    messages() {
        return {
            title: { min: 'Title must have at least :param characters!' },
            age: { min: 'You must be at least :param years old!' },
        };
    }
}
