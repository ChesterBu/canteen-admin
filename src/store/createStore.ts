export type TUser = {
    account: string
    role: 1 | 2 | 3 | 4   // 1-4 食堂，供应商，财务部，管理员
}

enum AppTitle {
    "食堂系统" = 1,
    "供应商系统" = 2,
    "财务部系统" = 3,
    "管理员系统" = 4
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
        },
        get appTitle () {
            return AppTitle[this.role || 1]
        }
    }
}

export type TStore = ReturnType<typeof createStore>