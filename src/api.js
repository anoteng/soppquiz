import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
    baseURL: 'https://mongosopp-api-uyhammddta-ez.a.run.app',
    json: true
})

export default {
    async execute (method, resource, data) {
        // inject the accessToken for each request
        let accessToken = await Vue.prototype.$auth.getAccessToken()
        return client({
            method,
            url: resource,
            data,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(req => {
            return req.data
        })
    },
    getEdible () {
        return this.execute('get', '/api/edible')
    },
    getPosts () {
        return this.execute('get', '/api/species')
    },
    getPost (id) {
        return this.execute('get', `/api/species/${id}`)
    },
    createPost (data) {
        return this.execute('post', '/api/species', data)
    },
    updatePost (id, data) {
        return this.execute('put', `/api/species/${id}`, data)
    },
    deletePost (id) {
        return this.execute('delete', `/api/species/${id}`)
    }
}