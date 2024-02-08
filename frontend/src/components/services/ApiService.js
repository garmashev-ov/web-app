
export async function ApiService(url, params = {headers: {}}) {
    const accessToken = window.localStorage.getItem("access");
    const refreshToken = window.localStorage.getItem("refresh");
    const newParams = {
        ...params,
    };
    if (accessToken) {
        if (!("headers" in newParams)) {
            newParams.headers = {}
        }
        newParams.headers.Authorization = `Bearer ${accessToken}`;
    }
    const response = await fetch(`http://127.0.0.1:8000/api/${url}`, newParams);
    let data = null;
    if (response.status === 401 && refreshToken) {
        const refreshData = await fetch(
            `http://127.0.0.1:8000/api/token/refresh/`,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            }
        );
        const { access } = await refreshData.json();
        window.localStorage.setItem("access", access);
        newParams.headers.Authorization = `Bearer ${access}`;
        const newresponse = await fetch(
            `http://127.0.0.1:8000/api/${url}`,
            newParams,
        );
        if (response.status === 204) {
            return null;
        }
        data = await newresponse.json();
        data["status"] = newresponse.status;
    } else {
        if (response.status === 204) {
            return null;
        }
        data = await response.json();
        data["status"] = response.status;
    }
    
    return data;
}