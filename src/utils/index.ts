import { TUser } from '../store/createStore';

export const useCookie = (): TUser => {
    let pattern = /([^=]+)=([^;]+);?\s*/g,
        result,
        value = {};
    while((result = pattern.exec(document.cookie)) != null) {
        value[result[1]] = result[2];
    }
    return {
        account: decodeURI(value['principalMan']),
        role: Number(value['user_role']) as any 
    }
}