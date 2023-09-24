import axios from 'axios';

const instance = axios.create({
  baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
  headers: {
    'Host': 'ticketing.dev',
  }
});

export default instance;