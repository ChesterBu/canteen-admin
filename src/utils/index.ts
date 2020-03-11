export const useCookie = (cookie="user_id") => {
    let pattern = /([^=]+)=([^;]+);?\s*/g,
        result,
        value = {};
    while((result = pattern.exec(document.cookie)) != null) {
        value[result[1]] = result[2];
    }
    return value[cookie];
}