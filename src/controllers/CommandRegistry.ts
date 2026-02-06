import { ICommand, ViewHandler } from "../types";
import { ICommandRegistry } from "../abstractions/ICommandRegistry";
import { CommandController } from "./CommandController";

class Command implements ICommand {
    readonly name: string;
    readonly pipeline: readonly string[];
    readonly viewHandler: ViewHandler;

    constructor(
        name: string,
        pipeline: readonly string[],
        viewHandler: ViewHandler,
    ) {
        this.name = name;
        this.pipeline = Object.freeze([...pipeline]);
        this.viewHandler = viewHandler;
    }
}

export class CommandRegistry implements ICommandRegistry {
    private readonly commands: Map<string, ICommand> = new Map();

    constructor(_controller: CommandController) {
        this.registerDefaultCommands();
    }

    private registerDefaultCommands(): void {
        const {
            addTask,
            updateTask,
            deleteTask,
            listTasks,
            markInProgress,
            markDone,
        } = require("../views/TaskView")
            .views as typeof import("../views/TaskView").views;

        this.register("add", ["validate", "create-task", "print"], addTask);
        this.register(
            "update",
            ["validate", "update-task", "print"],
            updateTask,
        );
        this.register(
            "delete",
            ["validate", "delete-task", "print"],
            deleteTask,
        );
        this.register("list", ["validate", "execute", "print"], listTasks);
        this.register(
            "mark-in-progress",
            ["validate", "mark-in-progress", "print"],
            markInProgress,
        );
        this.register(
            "mark-done",
            ["validate", "mark-done", "print"],
            markDone,
        );
    }

    register(
        name: string,
        pipeline: readonly string[],
        viewHandler: ViewHandler,
    ): void {
        const command = new Command(name, pipeline, viewHandler);
        this.commands.set(name, command);
    }

    get(name: string): ICommand | undefined {
        return this.commands.get(name);
    }

    has(name: string): boolean {
        return this.commands.has(name);
    }

    all(): readonly ICommand[] {
        return Object.freeze(Array.from(this.commands.values()));
    }
}
