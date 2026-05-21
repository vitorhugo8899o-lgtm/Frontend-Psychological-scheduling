import { api } from "./api";



async function GetAllServices(params) {
    try {
        const response = await api('/api/v1/services', {
            method: "GET",
            credentials: 'include'
        })
        return response

    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Error Status: ${status}, detalhe: ${detail}`
        }

        throw new Error(errorMessage);
    }
}


async function SearchService(filter) {
    const params = new URLSearchParams({
        option: filter.option || 'and',
        offset: filter.offset || 0,
        limit: filter.limit || 5
    })

    if (filter.name) params.append('name', filter.name)
    if (filter.price) params.append('price', filter.price)
    if (filter.duration_minutes) params.append('duration_minutes', filter.duration_minutes);

    try {
        const response = await api(`/api/v1/services/filter?${params.toString()}`, {
            method: "GET",
            credentials: 'include'
        })

        return response
    }
    catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            errorMessage = `Error Status: ${status}, detalhe: ${detail}`
        }

        throw new Error(errorMessage);
    }
}


async function CreateService(data_service) {
    const payload = {
        'name': data_service.name,
        'description': data_service.description,
        'price': data_service.price,
        'duration_minutes': data_service.duration_minutes
    }

    try {
        const response = await api('/api/v1/services', {
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


async function GetFinancialReport(data) {
    const payload = {
        'start_date': data.start_date,
        'end_date': data.end_date
    }

    try {
        const response = await api('/api/v1/financial-report', {
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


export { GetAllServices, SearchService, CreateService, GetFinancialReport }
