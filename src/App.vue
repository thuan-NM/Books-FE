<script setup>
import { ref, watchEffect } from 'vue';
import UserService from '@/services/auth.service';
import NarBar from "./components/NavBar.vue"
import Footer from "./components/Footer.vue"
import Banner from '@/components/Banner.vue';
import { useStore } from 'vuex';
const store = useStore();

watchEffect(async () => {
  await store.dispatch('fetchUser');
  console.log(store.state.user);
});
</script>

<template>
  <div>
    <NarBar v-if="store.state.user"/>
    <Banner v-if="store.state.user"/>
    <router-view />
    <Footer v-if="store.state.user"/>
  </div>
</template>
