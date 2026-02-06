export class CliError extends Error {
    constructor(message: string) {
        super(message);
        (this as { name: string }).name = "CliError";
        Object.setPrototypeOf(this, CliError.prototype);
    }
}

export class ValidationError extends CliError {
    constructor(message: string) {
        super(message);
        (this as { name: string }).name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class NotFoundError extends CliError {
    constructor(resource: string, id: string) {
        super(`${resource} not found: ${id}`);
        (this as { name: string }).name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
