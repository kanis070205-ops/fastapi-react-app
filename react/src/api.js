import axios from 'axios';

const api=axios.create({
    baseURL:'https://fastapi-backend-nacn.onrender.com'
}) ;

export default api;