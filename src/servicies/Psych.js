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


async function GetHistoryAppoiment() {
    try {
        const response = await api('/api/v1/psych/me/appointments', {
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


async function CreateAvaibility(data_avaibility) {
    const payload = {
        'availabilities': [{
            'days_of_the_week': [],
            'start_time': data_avaibility.start_time,
            'end_time': data_avaibility.end_time
        }
        ]
    }

    try {
        const response = await api('/api/v1/psych/me/avaibility', {
            method: "POST",
            body: JSON.stringify(payload),
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


async function DeleteAvaliability(data_avaibility) {
    const payload = {
        'days_of_the_week': data_avaibility.days_of_the_week,
        'start_time': data_avaibility.start_time,
        'end_time': data_avaibility.end_time
    }

    try {
        const response = await api('/api/v1/psych/me/avaibility', {
            method: "DELETE",
            body: JSON.stringify(payload),
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


async function MetricsCountAppoiments(date) {
    const payload = {
        'start_date': date.start_date,
        'end_date': date.end_date
    }

    try {
        const response = await api('/api/v1/psych/me/stats/appoinment-count', {
            method: "POST",
            body: JSON.stringify(payload),
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


async function MetricsRateAppoiments() {
    try {
        const response = await api('/api/v1/psych/me/stats/rate-appoinments', {
            method: 'GET',
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


async function CreateRecord(data_record) {
    const paylaod = {
        'id_user': data_record.id_user,
        'id_appoiment': data_record.id_appoiment,
        'description': data_record.description
    }

    try {
        const response = await api('/api/v1/medical-record', {
            method: "POST",
            body: JSON.stringify(payload),
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


async function DeleteRecord(data_record) {
    const payload = {
        'record_id': data_record.id
    }

    try {
        const response = await api('/api/v1/medical-record', {
            method: "DELETE",
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





export {
    GetAllPsychs,
    CreatePsych,
    GetNextsPsychAppoiments,
    GetHistoryAppoiment,
    CreateAvaibility,
    DeleteAvaliability,
    MetricsCountAppoiments,
    MetricsRateAppoiments,
    CreateRecord
}
