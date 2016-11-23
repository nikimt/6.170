const BASE_URL = 'http://localhost:3000/boards'

var request = require('request-promise-native')

export default {
    getBoard : (boardId) => {
        return request({
            uri : BASE_URL + `/${boardId}`,
            method: 'GET',
            json : true
        });
    },

    createBoard : () => {
        return request({
            uri : BASE_URL,
            method: 'POST',
            json : true
        });
    },

    deleteBoard : (boardId) => {
        return request({
            uri : BASE_URL + `/${boardId}`,
            method: 'DELETE'
        });
    }
}