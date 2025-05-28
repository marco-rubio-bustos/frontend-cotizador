const host = import.meta.env.VITE_LOCALHOST_URL
const portApi = import.meta.env.VITE_API_URL
const portFront = import.meta.env.VITE_FRONT_URL

export const URL_API = `${portApi}`;
export const URL_FRONT = `${host}${portFront}`;
