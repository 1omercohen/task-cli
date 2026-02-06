import { ICommand } from "../types";

export interface ICommandRegistry {
    register(
        name: string,
        pipeline: readonly string[],
        viewHandler: (result: unknown) => void,
    ): void;
    get(name: string): ICommand | undefined;
    has(name: string): boolean;
    all(): readonly ICommand[];
}
