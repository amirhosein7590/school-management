    import type { Options } from "../select/options"

    type InputType = "text" | "password" | "number" | "select" | "file" | "range" | "textarea" | "datePicker" | "timePicker"
    
    export type Input = {
        type : InputType,
        name : string,
        title ?: string,
        placeholder ?: string,
        className ?: string,
        maxLength ?: number,
        minLength ?: number,
        multiple ?: boolean,
        rules ?: {
            required : string | boolean,
            pattern ?: {
                value : RegExp,
                message : string
            }
        },
        options ?: Options
    }