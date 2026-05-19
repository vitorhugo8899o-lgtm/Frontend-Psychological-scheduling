import { api } from "./api"

async function GetAllPsychs(params) {
    try {
        const response = await api('/api/v1/psych', {
            method: "GET",
            credentials: 'include'
        })

        return response
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro. Status: ${status}, detalhe: ${detail}`
        }
        throw new Error(errorMessage);
    }
}








export { GetAllPsychs }
