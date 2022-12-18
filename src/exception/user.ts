export class UserValidationException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UnauthenticatedException extends Error {
    constructor(message: string) {
        super(message);
    }
}
