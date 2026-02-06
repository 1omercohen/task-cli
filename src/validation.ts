import { VALIDATION_RULES, ActionType, ACTIONS } from "./config";
import { ValidationError } from "./errors";

export function isValidAction(action: unknown): action is ActionType {
    return Object.values(ACTIONS).includes(action as ActionType);
}

export function buildParams(
    action: ActionType,
    params: Readonly<Record<string, string | undefined>>,
): Readonly<Record<string, unknown>> {
    const errors: string[] = [];
    const rules = VALIDATION_RULES[action];

    if (!rules) {
        throw new ValidationError(`No validation rules for action: ${action}`);
    }

    const result: Record<string, unknown> = { action };

    for (const rule of rules) {
        const value = params[rule.name];
        const isEmpty = value === undefined || value === "";

        if (isEmpty) {
            if (rule.required) {
                errors.push(`${rule.name} is required`);
            } else if (rule.default !== undefined) {
                result[rule.name] = rule.default;
            }
        } else {
            if (rule.options && !rule.options.includes(value)) {
                errors.push(
                    `${rule.name} must be one of: ${rule.options.join(", ")}`,
                );
            } else {
                result[rule.name] = value;
            }
        }
    }

    if (errors.length > 0) {
        throw new ValidationError(errors.join("\n"));
    }

    return Object.freeze(result);
}
