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


async function CreatePsych(data_psych) {
    const payload = {
        'email': data_psych.email,
        'region': data_psych.region,
        'number': data_psych.number
    }

    try {
        const response = await api('/api/v1/psychologist', {
            method: "POST",
            body: JSON.stringify(payload),
            credentials: 'include'
        })
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


async function GetNextsPsychAppoiments() {
    try {
        const response = await api('/api/v1/psych/me/next-appoiments', {
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


export { GetAllPsychs, CreatePsych, GetNextsPsychAppoiments }
