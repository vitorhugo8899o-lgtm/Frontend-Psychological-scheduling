import { use } from "framer-motion/m";
import { api } from "./api"

async function GetAllPsychs() {
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
        const response = await api('/api/v1/psych/me/availability', {
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
        const response = await api('/api/v1/psych/me/availability', {
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


async function MetricsCountAppoiments() {
    try {
        const response = await api('/api/v1/psych/me/stats/appoinment-count', {
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
    const payload = {
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


async function GetHistoryRecord() {
    try {
        const response = await api('/api/v1/medical-records', {
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


async function GetUserRecords(user_id) {
    const payload = {
        'user_id': user_id
    }

    try {
        const response = await api('/api/v1/user/medical-records', {
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


async function GetAvaliabilitys() {
    try {
        const response = await api('/api/v1/psych/me/availability', {
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

export {
    GetAllPsychs,
    CreatePsych,
    GetNextsPsychAppoiments,
    GetHistoryAppoiment,
    CreateAvaibility,
    DeleteAvaliability,
    MetricsCountAppoiments,
    MetricsRateAppoiments,
    CreateRecord,
    GetHistoryRecord,
    GetUserRecords,
    GetAvaliabilitys
}
