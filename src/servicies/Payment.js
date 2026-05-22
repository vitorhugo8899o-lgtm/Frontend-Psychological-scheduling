import { api } from "./Api";




async function GetPaymentLink(appointmentId) {
    const payload = {
        'appointment_id': appointmentId
    };
    try {
        const response = await api("/api/v1/payments", {
            method: "POST",
            body: JSON.stringify(payload),
            credentials: 'include'
        });
        return response;
    } catch (error) {
        let errorMessage = "Erro de conexão com o servidor. Tente novamente.";
        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;
            errorMessage = `Erro ao gerar link de pagamento. Status: ${status}, detalhe: ${detail}`;
        }
        throw new Error(errorMessage);
    }
}


export { GetPaymentLink }