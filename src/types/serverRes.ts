export type TError = {
    error : string,
    status : number
}

export type TRes = {
    message : string,
    status : number,
    [key : string] : unknown
}