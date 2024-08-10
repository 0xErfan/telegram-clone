import axios from "axios";

const useAxios = async (url: string, method: 'GET' | 'POST' = 'GET', body?: unknown, params?: string | string[]) => {

    let data, error;

    await axios.get(url, method == 'GET' ? {params: params} : body!)
        .then(res => data = res.data)
        .catch(err => error = err)

    return [data, error];
};

export default useAxios;