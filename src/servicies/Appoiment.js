import { api } from "./api";


async function GetUserNextsAppoiments() {
    try {
        const response = await api('/api/v1/users/me/next-appointments', {
            method: "GET",
            credentials: 'include'
        }
        )

        return response
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";
        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao carregar consultas. Status: ${status}, detalhe: ${detail}`
        }

        throw new Error(errorMessage);
    }
}


async function SimulationAppoiment(data) {
    const payload = {
        'date_time': data.date_time,
        'service_id': data.service_id
    }

    try {
        const response = await api('/api/v1/appointments/simulation', {
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

            errorMessage = `Erro ao buscar disponibilidades. Status: ${status}, detalhe: ${detail}`
        }

        throw new Error(errorMessage);
    }
}


async function GetAllAppoimentsUser(params) {
    try {
        const response = await api('/api/v1/users/me/appointments', {
            method: "GET",
            credentials: 'include'
        })

        return response
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao historico. Status: ${status}, detalhe: ${detail}`
        }
        throw new Error(errorMessage);
    }
}


async function CreateAppointment(data) {
    const payload = {
        'id_psychologist': data.psychologist_id,
        'service_id': data.service_id,
        'date_time': data.date_time
    }

    try {
        const response = await api("/api/v1/appointments", {
            method: "POST",
            body: JSON.stringify(payload),
            credentials: 'include'
        })
        return response

    } catch (error) {
        let errorMessage =
            "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {

            const status = error.response.status;
            const detail = error.response.data?.detail;

            if (Array.isArray(detail)) {

                errorMessage = detail
                    .map(err => err.msg)
                    .join(" | ");

            } else if (typeof detail === 'string') {

                errorMessage = detail;

            } else {

                errorMessage =
                    `Erro ao marcar consulta. Status: ${status}`;
            }
        }

        throw new Error(errorMessage);
    }
}


async function RescheduleAppointment(appoiment) {
    const payload = {
        'id_appointment': appoiment.id_appointment,
        'date_new': appoiment.date_new
    }

    try {
        const response = await api("/api/v1/appoiments/rescheduling", {
            method: "POST",
            body: JSON.stringify(payload),
            credentials: 'include'
        })

    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao remarcar consulta. Status: ${status}, detalhe: ${detail}`
        }
        throw new Error(errorMessage);
    }
}


async function CancelAppoiment(appoiment) {
    const payload = {
        'id_appointment': appoiment.id_appointment
    }

    try {
        const response = await api("/api/v1/appoiments/cancel", {
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

            errorMessage = `Erro ao cancelar consulta. Status: ${status}, detalhe: ${detail}`
        }
        throw new Error(errorMessage);
    }
}


async function GetAppoimentOpen() {
    try {
        const response = await api('/api/v1/users/me/open-appoiments', {
            method: "GET",
            credentials: 'include'
        })

        return response
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao buscar consultas. Status: ${status}, detalhe: ${detail}`
        }
        throw new Error(errorMessage);
    }
}



export {
    GetUserNextsAppoiments,
    SimulationAppoiment,
    GetAllAppoimentsUser,
    CreateAppointment,
    RescheduleAppointment,
    CancelAppoiment,
    GetAppoimentOpen
}
