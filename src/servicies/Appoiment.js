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


async function ScheduleAppointment(data) {
    const payload = {
        'id_psychologist': data.id_psychologist,
        'service_id': data.service_id,
        'date_time': data.date_time
    }

    try {
        const response = await api("/api/v1/appoiments", {
            mthod: "POST",
            body: JSON.stringify(payload),
            credentials: 'include'
        })
        return response

    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Erro ao marcar consulta. Status: ${status}, detalhe: ${detail}`
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


export {
    GetUserNextsAppoiments,
    SimulationAppoiment,
    GetAllAppoimentsUser,
    ScheduleAppointment,
    RescheduleAppointment
}
