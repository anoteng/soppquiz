import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import PostsManager from '@/components/PostsManager'
import artsdatabase from '@/components/artsdatabase'
import OktaVue, { LoginCallback } from '@okta/okta-vue'
import { OktaAuth } from '@okta/okta-auth-js'

const oktaAuth = new OktaAuth({
    issuer: 'https://dev-7085657.okta.com/oauth2/default',
    clientId: '0oa2ai1wrrVg3pWZX5d7',
    redirectUri: window.location.origin + '/callback',
    scopes: ['openid', 'profile', 'email']
})

Vue.use(Router)
Vue.use(OktaVue, { oktaAuth })

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/callback',
            component: LoginCallback
        },
        {
            path: '/posts-manager',
            name: 'PostsManager',
            component: PostsManager,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/artsdatabase',
            name: 'Artsdatabase',
            component: artsdatabase,
            meta: {
                requiresAuth: true
            }
        }
    ]
})

export default router