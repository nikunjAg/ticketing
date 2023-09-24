import clientAxios from '../redux/clientAxios';
import serverAxios from '../redux/serverAxios';

export const sendRequest = (axiosConfig) => {
  if (typeof window === 'undefined') {
    // On Server
    return serverAxios(axiosConfig);
  } else {
    // On Client
    return clientAxios(axiosConfig);
  }
}