import { PersistedItem } from "./item";
import { Errors } from "./errors";

export type Validator<T> = (payload: PersistedItem<T>) => Errors;
