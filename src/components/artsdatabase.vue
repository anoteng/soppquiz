<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Posts Manager</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <input v-model="search" class="form-control" placeholder="Filtrer">
        <table class="table table-striped">
          <thead>
          <tr>
            <th v-for="column in columns" :key="column">
              <a href="#" v-on:click="sortBy(column)" >
                {{ column | capitalize }}
              </a>
            </th>
<!--            <th>ID</th>-->
<!--            <th>Slekt</th>-->
<!--            <th>Art</th>-->
<!--            <th>Norsk navn</th>-->
<!--            <th>Engelsk navn</th>-->
<!--            <th>Spiselighet</th>-->
<!--            <th>Beskrivelse</th>-->
<!--            <th>&nbsp;</th>-->
          </tr>
          </thead>
          <tbody>
          <tr v-for="post in posts" :key="post._id">
            <td>{{ post._id }}</td>
            <td>{{ post.genus }}</td>
            <td>{{ post.species}}</td>
            <td>{{ post.norwegian }}</td>
            <td>{{ post.english }}</td>
            <td>{{ post.edibleCat }}</td>
            <td>{{ post.decription }}</td>
            <td class="text-right">
              <a href="#" @click.prevent="populatePostToEdit(post)">Edit</a> -
              <a href="#" @click.prevent="deletePost(post._id)">Delete</a>
            </td>
          </tr>
          </tbody>
        </table>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model._id ? 'Edit Post ID#' + model._id : 'Ny art')">
          <form @submit.prevent="savePost">
            <b-form-group label="Slekt">
              <b-form-input type="text" v-model="model.genus"></b-form-input>
            </b-form-group>
            <b-form-group label="Art (latin)">
              <b-form-input type="text" v-model="model.species"></b-form-input>
            </b-form-group>
            <b-form-group label="Norsk navn">
              <b-form-input type="text" v-model="model.norwegian"></b-form-input>
            </b-form-group>
            <b-form-group label="Engelsk navn">
              <b-form-input type="text" v-model="model.english"></b-form-input>
            </b-form-group>
            <b-form-group label="Beskrivelse">
              <b-form-textarea rows="4" v-model="model.body"></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Lagre</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      columns: ['ID',	'Slekt',	'Art',	'Norsk navn',	'Engelsk navn',	'Spiselighet',	'Beskrivelse'],
      loading: false,
      posts: [],
      model: {}
    }
  },
  async created () {
    this.refreshPosts()
  },
  methods: {
    async refreshPosts () {
      this.loading = true
      this.posts = await api.getPosts()
      this.edible = await api.getEdible()
      for(let i in this.posts) {
        let edible
        for(let j in this.edible){
          if(this.posts[i].edible == this.edible[j]._id){
            edible = this.edible[j].cat
          }
        }
        this.posts[i].edibleCat = edible
      }
      this.loading = false
    },
    async populatePostToEdit (post) {
      this.model = Object.assign({}, post)
    },
    async savePost () {
      if (this.model._id) {
        await api.updatePost(this.model._id, this.model)
      } else {
        await api.createPost(this.model)
      }
      this.model = {} // reset form
      await this.refreshPosts()
    },
    async deletePost (id) {
      if (confirm('Are you sure you want to delete this post?')) {
        // if we are editing a post we deleted, remove it from the form
        if (this.model._id === id) {
          this.model = {}
        }
        await api.deletePost(id)
        await this.refreshPosts()
      }
    }
  }
}
</script>