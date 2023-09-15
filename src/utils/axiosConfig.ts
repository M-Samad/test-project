import axios from 'axios';
import { getBaseURLToDev } from './variables/General';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;


export const axiosInstance = axios.create({
  // baseURL: "https://api.github.com/repos/rutvij-fsd/test-flow-project/contents/",
  timeout: 10000,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3.raw'
  }
});

axiosInstance.interceptors.request.use(
  async config => {
    config.baseURL = getBaseURLToDev();

    return config;
  },
  (error: any) => {
    // Promise.reject('interceptors error : ', error);
    Promise.reject(error);
  },
);
