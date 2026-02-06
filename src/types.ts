export enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in progress",
    DONE = "done",
}

export interface Task {
    readonly id: string;
    readonly description: string;
    readonly status: TaskStatus;
    readonly createdAt: number;
    readonly updatedAt: number;
}

export interface MiddlewareContext {
    readonly action: string;
    readonly params: Readonly<Record<string, string | undefined>>;
    validatedParams?: Readonly<Record<string, unknown>>;
    result?: unknown;
    controller?: unknown;
}

export type MiddlewareFunction = (
    context: MiddlewareContext,
    next: () => Promise<void> | void,
) => Promise<void> | void;

export interface ValidationRule {
    readonly name: string;
    readonly required: boolean;
    readonly options?: readonly string[];
    readonly default?: string;
}

export interface ICommand {
    readonly name: string;
    readonly pipeline: readonly string[];
    readonly viewHandler: (result: unknown) => void;
}

export type ViewHandler = (result: unknown) => void;

export type CreateTaskInput = {
    readonly description: string;
    readonly status: TaskStatus;
};

export type UpdateTaskInput = Readonly<{
    id?: string;
    description?: string;
    status?: string;
}>;

export type ListTasksInput = Readonly<{
    status?: string;
}>;

export type DeleteTaskInput = Readonly<{
    id?: string;
}>;
