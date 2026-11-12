export type ErrorCode = 'NOT_SPECIFIED'
    | 'FILE_TOO_BIG'
    | 'FILE_TYPE_NOT_SUPPORTED'
    | 'UNAUTHORIZED'
    | 'NOT_FOUND'
    | 'BAD_INPUT'
    | 'DB_ERROR';

export class AppError extends Error {
    code: ErrorCode;

    constructor(message: string, code: ErrorCode) {
        super(message);
        this.name = 'AppError';
        this.code = code;
    }
}

// how to use it:
// throw new AppError("file is to big", "FILE_TOO_BIG");