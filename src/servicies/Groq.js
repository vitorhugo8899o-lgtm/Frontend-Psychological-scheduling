import { api } from "./api";





async function SendMessage(message) {
    const payload = { 'message': `${message}` }

    try {
        const response = await api("/api/v1/chat-user", {
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

            // Tratamento para o formato de validação do Pydantic (Array)
            let parsedDetail = "";
            if (Array.isArray(detail)) {
                parsedDetail = detail.map(err => err.msg).join(", ");
            } else if (typeof detail === 'object' && detail !== null) {
                parsedDetail = detail.message || JSON.stringify(detail);
            } else {
                parsedDetail = detail || "Erro desconhecido";
            }

            errorMessage = `Erro ao processar mensagem. Status: ${status}, detalhe: ${parsedDetail}`;
        }
        throw new Error(errorMessage);
    }
}


export { SendMessage }