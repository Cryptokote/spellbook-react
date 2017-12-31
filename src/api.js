import axios from 'axios';

class Api {
    login(email, password) {
        return axios.request({
            url: 'http://spellbook.tk/api/login',
            method: 'post',
            data: {email: email, password: password},
            withCredentials: true,
        })
    }
    register(email, password, userName) {
        return axios.request({
            url: 'http://spellbook.tk/api/register',
            method: 'post',
            data: {email: email, password: password, username: userName},
            withCredentials: true,
        })
    }
    logout() {
        return axios.request({
            url: 'http://spellbook.tk/api/logout',
            method: 'post',
            withCredentials: true,
        })
    }
    getUserData() {
        return axios.request({
            url: 'http://spellbook.tk/api/get_user_data',
            method: 'get',
            withCredentials: true
        })
    }
    getClassSpells(className) {
        return axios.request({
            url: 'http://spellbook.tk/api/spells',
            method: 'get',
            params: {class: className},
            withCredentials: true
        })
    }
    getFavorites() {
        return axios.request({
            url: 'http://spellbook.tk/api/get_fav',
            method: 'get',
            withCredentials: true
        })
    }
    addFavorite(id) {
        return axios.request({
            url: 'http://spellbook.tk/api/add_fav',
            method: 'post',
            data: {id: id},
            withCredentials: true
        })
    }
    removeFavorite(id) {
        return axios.request({
            url: 'http://spellbook.tk/api/rem_fav',
            method: 'post',
            data: {id: id},
            withCredentials: true
        })
    }
}

const apiService = new Api();
export default apiService;