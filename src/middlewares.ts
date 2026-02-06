import { MiddlewareContext, MiddlewareFunction } from "./types";
import { buildParams } from "./validation";
import { CliError, ValidationError } from "./errors";
import { ActionType } from "./config";

export const createValidateMiddleware = (
    action: ActionType,
): MiddlewareFunction => {
    return (
        context: MiddlewareContext,
        next: () => void | Promise<void>,
    ): void => {
        try {
            const validated = buildParams(action, context.params);
            (
                context as MiddlewareContext & {
                    validatedParams: Readonly<Record<string, unknown>>;
                }
            ).validatedParams = validated;
            void next();
        } catch (err) {
            if (err instanceof ValidationError) {
                throw err;
            }
            throw new CliError(
                `Validation: ${err instanceof Error ? err.message : String(err)}`,
            );
        }
    };
};

export const createHandlerMiddleware = (
    handlerMethodName: string,
): MiddlewareFunction => {
    return async (
        context: MiddlewareContext,
        next: () => void | Promise<void>,
    ): Promise<void> => {
        try {
            const { controller, validatedParams } = context;
            if (!controller) {
                throw new CliError("Controller not initialized");
            }

            const handler = (controller as Record<string, unknown>)[
                handlerMethodName
            ];
            if (!handler || typeof handler !== "function") {
                throw new CliError(`Handler "${handlerMethodName}" not found`);
            }

            const typedHandler = handler as (
                params: Readonly<Record<string, unknown>>,
            ) => Promise<unknown>;
            (context as MiddlewareContext & { result: unknown }).result =
                await typedHandler.call(
                    controller,
                    validatedParams ?? Object.freeze({}),
                );
            await Promise.resolve(next());
        } catch (err) {
            if (err instanceof CliError) throw err;
            throw new CliError(
                `Handler error: ${err instanceof Error ? err.message : String(err)}`,
            );
        }
    };
};

export const createPrintMiddleware = (
    viewHandler: (result: unknown) => void,
): MiddlewareFunction => {
    return (
        context: MiddlewareContext,
        next: () => void | Promise<void>,
    ): void => {
        try {
            viewHandler(context.result);
            void next();
        } catch (err) {
            throw new CliError(
                `Print error: ${err instanceof Error ? err.message : String(err)}`,
            );
        }
    };
};
