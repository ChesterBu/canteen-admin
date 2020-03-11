export type TUser = {
    account: string
    role: 1 | 2 | 3 | 4   // 1-4 食堂，供应商，财务部，管理员
}



export function createStore () {
    return {
        user: {} as TUser,
        collapsed: false,
        setUser (user:TUser) {
            this.user = { ...user }
        },
        toggle () {
            this.collapsed = !this.collapsed
        },
        get account() {
            return this.user.account
        },
        setAccount (account) {
            this.user.account = account
        },
        get role () {
            return this.user.role
        }
    }
}

export type TStore = ReturnType<typeof createStore>