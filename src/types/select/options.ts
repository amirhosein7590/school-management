import type { FormRequest } from "../form/request"

export type Option = {label : string , value : string}

export type OptionGenerator = FormRequest & {
    optionsGenerator : (data: any[]) => Option[];
};

export type Options = Option[] | OptionGenerator