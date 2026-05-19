import { api } from "./api";




async function CreatePayment(appointment_id) {
    const payload = { 'appointment_id': `${appointment_id}` }

    try {
        const response = await api('/api/v1/payments', {
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

            errorMessage = `Erro ao Processar pagamento. Status: ${status}, detalhe: ${detail}`
        }
        throw new Error(errorMessage);
    }
}


export { CreatePayment }