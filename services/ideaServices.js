const BASE_URL = 'http://localhost:3000/boards';

var request = require('request-promise-native');

export default {
    getIdeasByBoard : (boardId) => {
        return request({
            uri : BASE_URL + `/${boardId}/ideas`,
            method: 'GET',
            json : true
        });
    },

    getIdea : (boardId, ideaId) => {
        return request({
            uri : BASE_URL + `/${boardId}/ideas/${ideaId}`,
            method: 'GET',
            json : true
        });
    },

    createIdea : (boardId, content) => {
        return request({
            uri : BASE_URL + `/${boardId}/ideas`,
            method: 'POST',
            body: {
                content: content
            },
            json : true
        });
    },

    deleteIdea : (boardId, ideaId) => {
        return request({
            uri : BASE_URL + `/${boardId}/ideas/${ideaId}`,
            method: 'DELETE',
        });
    },

    addUpvoteToIdea : (boardId, ideaId) => {
        return request({
            uri : BASE_URL + `/${boardId}/ideas/${ideaId}/upvote`,
            method: 'PUT',
        });
    },

    removeUpvoteFromIdea : (boardId, ideaId) => {
        return request({
            uri : BASE_URL + `/${boardId}/ideas/${ideaId}/upvote`,
            method: 'DELETE',
        });
    }
}