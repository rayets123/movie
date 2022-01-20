<template>
  <div>
    <v-app dark>
      <loader></loader>
      <!-- LEFT SIDEBAR-->
      <v-navigation-drawer v-model='drawer' clipped fixed app>
        <v-list dense>

          <router-link class='layout row v-list__tile--link' to='/'>
            <v-list-item>
                <v-list-item-action>
                  <v-icon>dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Movies</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
          </router-link>

          <router-link class='layout row v-list__tile--link' to='/favorites'>
            <v-list-item v-if='$auth.token()'>
                <v-list-item-action>
                  <v-icon>favorite</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Favorites</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
           </router-link>

        </v-list>
      </v-navigation-drawer>
      <!-- LEFT SIDEBAR-->

      <!-- TOP LINE-->
      <v-toolbar fixed>
        <v-app-bar-nav-icon clipped-left @click.stop='drawer = !drawer'></v-app-bar-nav-icon>
        <v-toolbar-title class='mr-5 text-xs-left'><router-link to='/'>Movies</router-link></v-toolbar-title>
        <v-autocomplete
          v-model='model'
          :items='found'
          :loading='isLoading'
          :search-input.sync='search'
          clearable
          hide-details
          hide-selected
          item-text='title'
          item-value='poster_path'
          label='Search for a movie...'
          solo
        >
          <template slot='no-data'>
            <v-list-item>
              <v-list-item-title>
                Search for your favorite
                <strong>Movies</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
          <template
            slot='item'
            slot-scope='{ item }'
          >
            <router-link :to='`/movie/${item.id}`'>
            <v-layout justify-center align-center row >
              <v-list-item-avatar>
              <img :src='`${config.smImg}${item.poster_path}`' alt='alt'>
              </v-list-item-avatar>
              <v-list-item-content class='white--text'>
                <v-list-item-title v-text='item.original_title'></v-list-item-title>
              </v-list-item-content>
              </v-layout>
            </router-link>
          </template>
        </v-autocomplete>

         <v-btn v-if='!$auth.token()' depressed color='secondary' @click='login()'>Login</v-btn>
         <v-btn v-if='$auth.token()' depressed color='secondary' @click='logout()'>Logout</v-btn>
      </v-toolbar>
      <!-- TOP LINE-->

      <!-- MAIN CONTENT-->
      <v-main>
        <v-container fluid class='pa-0'>
          <v-layout justify-center align-center>
            <v-flex>
              <router-view />
            </v-flex>
          </v-layout>
        </v-container>
      </v-main>
      <!-- MAIN CONTENT-->

    </v-app>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import loader from '@/components/Loader.vue'
import config from './config'
export default {
  name: 'App',
  components: {
    loader
  },
  data () {
    return {
      config,
      drawer: false,
      mini: true,
      isLoading: false,
      model: null,
      search: null
    }
  },
  computed: {
    ...mapGetters(['found'])
  },
  watch: {
    $route () {
      if (this.$route.params.id) {
        this.fetchEntity({
          id: this.$route.params.id
        })
        this.fetchSimilar({
          id: this.$route.params.id
        })
      }
    },
    search (val) {
      if (this.found.length > 0) return
      this.isLoading = true
      this.searchMovies({ query: val }).finally(() => (this.isLoading = false))
    }
  },
  created () {
    const favorites = JSON.parse(localStorage.getItem('favorites'))
    favorites && this.setFavorites(favorites)
  },
  methods: {
    ...mapActions([
      'fetchEntity',
      'fetchSimilar',
      'searchMovies',
      'setFavorites'
    ]),
    login () {
      this.$auth.login({
        fetchUser: false
      })
    },
    logout () {
      localStorage.removeItem('default_auth_token')
      this.$router.go()
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  min-height: 100vh;
}
a {
  text-decoration: none;
  /* color: #fff !important; */
}
.v-pagination__item {
  width: 45px;
}
.v-text-field.v-text-field--solo .v-input__control {
  min-height: 36px;
}
.router-link-exact-active {
  background: rgba(255, 255, 255, 0.08);
}
</style>