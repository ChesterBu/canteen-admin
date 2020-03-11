declare global {
    type Res = {
        errorCode: number
        errorMsg: string
        data: any
        ret: boolean
    }
}

export {
    Res
}
