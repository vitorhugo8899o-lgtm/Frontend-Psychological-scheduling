import { api } from "./api";


async function CreateUser(data) {
    const payload = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
    };

    try {
        const response = await api("/api/v1/users", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    } catch (error) {
        throw new Error(error.message || "Erro de conexão com o servidor.");
    }
}


async function Login(data) {
    const payload = {
        username: data.email,
        password: data.password,
        grant_type: "password",
        scope: "",
    };

    const formBody = new URLSearchParams(payload).toString();

    try {
        const response = await api("/api/v1/login", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: formBody,
            credentials: 'include'
        });
        return response;
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            if (status === 401) {
                errorMessage = "Login ou senha incorretos. Verifique suas credenciais.";
            } else if (detail) {
                errorMessage = detail;
            }
        }
        throw new Error(errorMessage);
    }
}


async function Logout() {
    try {
        const response = await api("/api/v1/logout", {
            method: "POST",
            credentials: 'include'
        }
        )
        return response
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao deslogar usuário. Status: ${status}, detalhe: ${detail}`
        }

        throw new Error(errorMessage);
    }
}


async function UpdateUserInfo(update_data) {
    const payload = {
        email: update_data.email,
        password: update_data.password
    }
    try {
        const response = await api("/api/v1/users", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
        return response;
    } catch (error) {
        throw new Error(error.message || "Erro de conexão com o servidor.");
    }
}


async function DesactiveAccount() {
    try {
        const response = await api("/api/v1/users", {
            method: "DELETE",
            credentials: 'include'
        }
        )
        return;
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao desativar usuário. Status: ${status}, detalhe: ${detail}`
        }

        throw new Error(errorMessage);
    }
}


async function GetUserAppoiment() {
    try {
        const response = await api("/api/v1/users/me/appointments", {
            method: "GET",
            credentials: 'include'
        })

        return response;
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao buscar consultas do usuário. Status: ${status}, detalhe: ${detail}`
        }

        throw new Error(errorMessage);
    }
}



export { CreateUser, Login, Logout, UpdateUserInfo, DesactiveAccount }
