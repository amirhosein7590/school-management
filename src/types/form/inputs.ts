import type {FormRequest} from "./request"
import type { Input } from "./input"
import type { Role } from "../Role"

export type FormInputs = Partial<FormRequest> & {
    inputs : Partial<FormRequest> & {
        [R in Role] ?: Input[];
    },
}