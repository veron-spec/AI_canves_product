<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">我的应用</div>
    <div class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/about">关于我们</RouterLink>
      <RouterLink to="/contact">联系我们</RouterLink>
    </div>
  </nav>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links a {
  color: white;
  text-decoration: none;
  margin-left: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: #555;
}

.nav-links a.router-link-active {
  background-color: #42b983;
}

main {
  padding: 2rem;
}
</style>
