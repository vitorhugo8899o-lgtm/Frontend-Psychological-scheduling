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



export { CreateUser }
