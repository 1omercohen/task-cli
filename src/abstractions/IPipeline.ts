import { MiddlewareContext, MiddlewareFunction } from "../types";

export interface IPipeline {
    use(fn: MiddlewareFunction): IPipeline;
    run(context: MiddlewareContext): Promise<void>;
}
