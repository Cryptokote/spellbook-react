import axios from 'axios';
import qs from 'qs';

class Api {
    login() {
        const params = qs.stringify({username: 'admin', password: 'admin'});
        return axios.request({
            url: 'http://localhost:8080/login',
            // url: 'http://canis-majoris.local:8080/login',
            method: 'post',
            data: params,
            withCredentials: true,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }
    getClassSpells(className) {
        return axios.request({
            url: 'http://localhost:8080/spells',
            // url: 'http://canis-majoris.local:8080/spells',
            method: 'get',
            params: {class: className},
            withCredentials: true
        })
    }
}

export default Api