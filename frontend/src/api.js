const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

export async function apiFetch(url, options = {}) {
    let token = localStorage.getItem("access_token");

    let response = await fetch(`${BASEURL}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            logoutAndRedirect();
            return response;
        }

        const refreshResponse = await fetch(
            `${BASEURL}/api/token/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            }
        );

        if (!refreshResponse.ok) {
            logoutAndRedirect();
            return response;
        }

        const data = await refreshResponse.json();

        localStorage.setItem("access_token", data.access);

        response = await fetch(`${BASEURL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${data.access}`,
            },
        });
    }

    return response;
}

function logoutAndRedirect() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("loggedInUser");

    window.dispatchEvent(new Event("authChanged"));

    window.location.replace("/login");
}