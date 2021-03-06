import axios from "axios";

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // we are on the server
        // k8s sample base url
        // 'http://SERVICENAME.NAMESPACE.svc.cluster.local'

        return axios.create({
            // baseURL: 'http://ingress-nginx.ingress-nginx.svc.cluster.local'
            baseURL: 'http://localhost:3000',
            headers: req.headers
        });
    } else {
        // we are on the browser
        return axios.create({
            baseURL: '/'
        });
    }
};