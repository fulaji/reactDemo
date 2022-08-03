const TOKEN_KEY = 'PROPERTY_MANAGER_TOKEN';
const ROLE_KEY = 'PROPERTY_MANAGER_ROLE';
const USER_KEY = 'PROPERTY_MANAGER_USER';

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, `bearer ${token}`);
}

export const setRole = (role) => {
    localStorage.setItem(ROLE_KEY, role);
}

export const setUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const getRole = () => {
    return localStorage.getItem(ROLE_KEY);
}

export const getUser = () => {
    return localStorage.getItem(USER_KEY);
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}

export const removeRole = () => {
    localStorage.removeItem(ROLE_KEY);
}

export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
}

export const isLogin = () => {
    if (localStorage.getItem(TOKEN_KEY)) {
        return true;
    }

    return false;
}