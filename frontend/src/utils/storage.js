export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("loggedInUser"));
};

export const saveCurrentUser = (user) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
};

export const logoutUser = () => {
    localStorage.removeItem("loggedInUser");
};

export const isLoggedIn = () => {
    return !! localStorage.getItem("access_token");
};