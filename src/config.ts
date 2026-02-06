import { TaskStatus, ValidationRule } from "./types";

export const STATUS = Object.freeze({
    TODO: TaskStatus.TODO,
    IN_PROGRESS: TaskStatus.IN_PROGRESS,
    DONE: TaskStatus.DONE,
} as const);

export const STATUS_OPTIONS = Object.freeze(
    Object.values(STATUS),
) as readonly string[];
export const LIST_STATUS_OPTIONS = Object.freeze([
    "done",
    "in_progress",
    "not_done",
    "all",
] as const);

export const ACTIONS = Object.freeze({
    ADD: "add",
    UPDATE: "update",
    DELETE: "delete",
    LIST: "list",
    MARK_IN_PROGRESS: "mark-in-progress",
    MARK_DONE: "mark-done",
} as const);

export type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

export const TASKS_PATH = "./tasks.json";

export const VALIDATION_RULES: Readonly<
    Record<ActionType, readonly ValidationRule[]>
> = Object.freeze({
    [ACTIONS.ADD]: Object.freeze([{ name: "description", required: true }]),
    [ACTIONS.UPDATE]: Object.freeze([
        { name: "id", required: true },
        { name: "description", required: false },
        { name: "status", required: false, options: STATUS_OPTIONS },
    ]),
    [ACTIONS.DELETE]: Object.freeze([{ name: "id", required: true }]),
    [ACTIONS.LIST]: Object.freeze([
        {
            name: "status",
            required: false,
            options: LIST_STATUS_OPTIONS as unknown as readonly string[],
            default: "all",
        },
    ]),
    [ACTIONS.MARK_IN_PROGRESS]: Object.freeze([{ name: "id", required: true }]),
    [ACTIONS.MARK_DONE]: Object.freeze([{ name: "id", required: true }]),
});

export const PIPELINES: Readonly<Record<ActionType, readonly string[]>> =
    Object.freeze({
        [ACTIONS.ADD]: Object.freeze(["validate", "create-task", "print"]),
        [ACTIONS.UPDATE]: Object.freeze(["validate", "update-task", "print"]),
        [ACTIONS.DELETE]: Object.freeze(["validate", "delete-task", "print"]),
        [ACTIONS.LIST]: Object.freeze(["validate", "execute", "print"]),
        [ACTIONS.MARK_IN_PROGRESS]: Object.freeze([
            "validate",
            "mark-in-progress",
            "print",
        ]),
        [ACTIONS.MARK_DONE]: Object.freeze(["validate", "mark-done", "print"]),
    });

export const STEP_TO_HANDLER = Object.freeze({
    "create-task": "createTask",
    "update-task": "updateTask",
    "delete-task": "deleteTask",
    execute: "execute",
    "mark-in-progress": "markInProgress",
    "mark-done": "markDone",
} as const);

export type StepHandler =
    (typeof STEP_TO_HANDLER)[keyof typeof STEP_TO_HANDLER];
