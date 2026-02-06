#!/usr/bin/env node

import { parseToJson } from "./utils";
import { TaskDB } from "./models/TaskDB";
import { CommandController } from "./controllers/CommandController";
import { CommandRegistry } from "./controllers/CommandRegistry";
import { CliPipeline } from "./pipeline";
import * as config from "./config";
import { ActionType } from "./config";
import {
    createValidateMiddleware,
    createHandlerMiddleware,
    createPrintMiddleware,
} from "./middlewares";
import { views } from "./views/TaskView";
import { CliError } from "./errors";
import { MiddlewareContext } from "./types";
import { ICommandRegistry } from "./abstractions/ICommandRegistry";
import { IPipeline } from "./abstractions/IPipeline";
import { ITaskRepository } from "./abstractions/ITaskRepository";

const MIDDLEWARE_TYPES = {
    VALIDATE: "validate",
    PRINT: "print",
} as const;

function buildPipeline(
    command: Readonly<{
        pipeline: readonly string[];
        viewHandler: (result: unknown) => void;
    }>,
    action: string,
): IPipeline {
    const app = new CliPipeline();

    command.pipeline.forEach((step: string) => {
        if (step === MIDDLEWARE_TYPES.VALIDATE) {
            app.use(createValidateMiddleware(action as ActionType));
        } else if (step === MIDDLEWARE_TYPES.PRINT) {
            app.use(createPrintMiddleware(command.viewHandler));
        } else if (
            Object.prototype.hasOwnProperty.call(config.STEP_TO_HANDLER, step)
        ) {
            const handlerMethodName = (
                config.STEP_TO_HANDLER as Record<string, string>
            )[step];
            app.use(createHandlerMiddleware(handlerMethodName));
        } else {
            throw new CliError(`Unknown pipeline step: ${step}`);
        }
    });

    return app;
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (!args.length) {
        views.help();
        return;
    }

    try {
        const db: ITaskRepository = new TaskDB();
        await db.ready;

        const controller = new CommandController(db);
        const registry: ICommandRegistry = new CommandRegistry(controller);

        const parsed = parseToJson(args);
        if (!parsed?.action) {
            throw new CliError("Failed to parse arguments.");
        }

        const command = registry.get(parsed.action as string);
        if (!command) {
            throw new CliError(`Unknown command: ${parsed.action}`);
        }

        const pipeline = buildPipeline(command, parsed.action as string);
        const context: MiddlewareContext = {
            action: parsed.action as string,
            params: parsed as Record<string, string | undefined>,
            controller,
        };

        await pipeline.run(context);
    } catch (err) {
        if (err instanceof CliError) {
            console.error(err.message);
        } else if (err instanceof Error) {
            console.error("Error:", err.message);
        } else {
            console.error("Unknown error");
        }
        process.exit(1);
    }
}

main().catch((err: unknown) => {
    console.error(
        "Fatal error:",
        err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
});
