import axios from 'axios';
import router from "@/router";

axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.resolve(error.response);
    }
);
axios.defaults.withCredentials = true;
function checkStatus(response) {
    console.log(response)
    // loading
    // 如果http状态码正常，则直接返回数据
    if (
        response &&
        (response.status === 200 ||
            response.status === 304 ||
            response.status === 400)
    ) {
        return response.data;
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        msg: "网络异常",
    };
}

function checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {
        // message.error('网络错误');
        return;
    }

    if (res.status === 10007) {
        // message.error('请重新登录');
        router.push('/login')
        return;
    }

    return res;
}

export default {
    upload(url, data) {
        console.log("data:",data)
        return axios({
            method: "POST",
            url,
            data,
            timeout: 50000,
            withCredentials: true
        }).then((response) => {
            return checkStatus(response);
        })
            .then((res) => {
                return checkCode(res);
            });
    },
    post(url, data, flag = 0) {
        console.log('sessionStorage===', sessionStorage.getItem('token'))
        return axios(
            {
                method: "POST",
                url,
                data,
                timeout: 50000,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json; charset=UTF-8",
                    'jwt_token': sessionStorage.getItem('token') || null
                },
                withCredentials: true,
            }
        )
            .then((response) => {
                return checkStatus(response);
            })
            .then((res) => {
                return checkCode(res);
            });
    },
    
    download(url, data, flag = 0) {
        console.log('sessionStorage===', sessionStorage.getItem('token'))
        return axios(
            {
                method: "POST",
                url,
                data,
                timeout: 50000,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json; charset=UTF-8",
                    'jwt_token': sessionStorage.getItem('token') || null,
                    
                },

            
                withCredentials: true,
            }
        )
            .then((response) => {
                return checkStatus(response);
            })
            .then((res) => {
                return checkCode(res);
            });
    },
    get(url, params, flag = 0) {
        console.log('sessionStorage===', sessionStorage.getItem('token'))
        return axios(
            {
                method: "get",
                url,
                params, // get 请求时带的参数
                timeout: 50000,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    'jwt_token': sessionStorage.getItem('token') || null,
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            },
        )
            .then((response) => {
                return checkStatus(response);
            })
            .then((res) => {
                return checkCode(res);
            });
    },
    put(url, data, flag = 0) {
  return axios({
    method: "PUT",
    url,
    data,
    timeout: 50000,
    headers: {
      "Content-Type": "application/json",
      'jwt_token': sessionStorage.getItem('token') || null
    },
    withCredentials: true
  }).then(checkStatus).then(checkCode);
},

delete(url, flag = 0) {
  return axios({
    method: "DELETE",
    url,
    timeout: 50000,
    headers: {
      'jwt_token': sessionStorage.getItem('token') || null
    },
    withCredentials: true
  }).then(checkStatus).then(checkCode);
}

};