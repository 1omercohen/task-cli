import { MiddlewareContext, MiddlewareFunction } from "./types";
import { CliError } from "./errors";
import { IPipeline } from "./abstractions/IPipeline";

export class CliPipeline implements IPipeline {
    private readonly stack: MiddlewareFunction[] = [];

    use(fn: MiddlewareFunction): IPipeline {
        this.stack.push(fn);
        return this;
    }

    async run(context: MiddlewareContext): Promise<void> {
        let index = 0;

        const next = async (): Promise<void> => {
            const middleware = this.stack[index++];
            if (middleware) {
                try {
                    await Promise.resolve(middleware(context, next));
                } catch (err) {
                    if (err instanceof CliError) {
                        console.error(err.message);
                    } else if (err instanceof Error) {
                        console.error("Pipeline error:", err.message);
                    } else {
                        console.error("Unknown error");
                    }
                    process.exit(1);
                }
            }
        };

        await next();
    }
}
