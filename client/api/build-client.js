import axios from "axios";

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // On the server side
    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers
    });
  } else {
    // On the client side
    return axios.create({
      baseURL: "/",
    });
  }
};