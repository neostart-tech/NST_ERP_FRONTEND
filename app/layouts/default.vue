<template>
  <div class="flex min-h-screen">
    <Sidebar
      :mobileSidebarOpen="sidebarVisible"
      @close-sidebar="sidebarVisible = false"
    />
    <div class="flex flex-col flex-1 lg:ml-64">
      <Header @toggle-sidebar="sidebarVisible = !sidebarVisible" />
      <main class="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

const sidebarVisible = ref(true);
</script>
