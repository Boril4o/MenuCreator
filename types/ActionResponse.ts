import {ErrorCode} from "@/types/AppError";

export type ActionError = {
    success: false;
    code: ErrorCode;
    message: string;
};

export type ActionSuccess<T> = {
    success: true;
    data: T;
};

export type ActionResponse<T> = ActionSuccess<T> | ActionError;