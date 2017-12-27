import axios from 'axios';
import qs from 'qs';

class Api {
    login(email, password) {
        return axios.request({
            url: 'http://spellbook.tk/api/login',
            // url: 'http://canis-majoris.local:8080/login',
            method: 'post',
            data: {email: email, password: password},
            withCredentials: true,
        })
    }
    register(email, password, userName) {
        return axios.request({
            url: 'http://spellbook.tk/api/register',
            // url: 'http://canis-majoris.local:8080/login',
            method: 'post',
            data: {email: email, password: password, username: userName},
            withCredentials: true,
        })
    }
    logout() {
        return axios.request({
            url: 'http://spellbook.tk/api/logout',
            // url: 'http://canis-majoris.local:8080/login',
            method: 'post',
            withCredentials: true,
        })
    }
    getUserData() {
        return axios.request({
            url: 'http://spellbook.tk/api/get_user_data',
            // url: 'http://canis-majoris.local:8080/spells',
            method: 'get',
            withCredentials: true
        })
    }
    getClassSpells(className) {
        return axios.request({
            url: 'http://spellbook.tk/api/spells',
            // url: 'http://canis-majoris.local:8080/spells',
            method: 'get',
            params: {class: className},
            withCredentials: true
        })
    }
    getFavorites() {
        return axios.request({
            url: 'http://spellbook.tk/api/get_fav',
            // url: 'http://canis-majoris.local:8080/spells',
            method: 'get',
            withCredentials: true
        })
    }
    addFavorite(id) {
        return axios.request({
            url: 'http://spellbook.tk/api/add_fav',
            // url: 'http://canis-majoris.local:8080/spells',
            method: 'post',
            data: {id: id},
            withCredentials: true
        })
    }
    removeFavorite(id) {
        return axios.request({
            url: 'http://spellbook.tk/api/rem_fav',
            // url: 'http://canis-majoris.local:8080/spells',
            method: 'post',
            data: {id: id},
            withCredentials: true
        })
    }
}

export default Api