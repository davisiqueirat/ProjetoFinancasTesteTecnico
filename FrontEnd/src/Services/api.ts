import axios from 'axios';

export const api = axios.create({
    // Atenção: Confirme se a porta do seu Swagger é 7033 ou outra.
    // Geralmente é https://localhost:7033 ou http://localhost:5xxx
    baseURL: 'https://localhost:7033/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api