<template>
  <header class="fixed top-0 left-0 right-0 bg-[#EDEEE8] shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <router-link to="/" class="text-3xl font-bold text-[#C24D45] tracking-wider">
          CampusRide
        </router-link>
        
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="nav-link" :class="{ 'active': $route.name === 'Home' }">
            Home
          </router-link>
          <router-link to="/rideshare" class="nav-link" :class="{ 'active': $route.name === 'Rideshare' }">
            Rideshare
          </router-link>
          <router-link to="/activities" class="nav-link" :class="{ 'active': $route.name === 'Activities' }">
            Activities
          </router-link>
          <router-link to="/marketplace" class="nav-link" :class="{ 'active': $route.name === 'Marketplace' }">
            Marketplace
          </router-link>
          <router-link to="/leaderboard" class="nav-link" :class="{ 'active': $route.name === 'Leaderboard' }">
            Leaderboard
          </router-link>
        </nav>
      </div>
      
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">Welcome!</span>
        <button @click="logout" class="text-[#C24D45] hover:text-[#A93E37]">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('userToken')
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-[#C24D45] font-medium relative px-2 py-1 transition-colors duration-300;
}

.nav-link.active {
  @apply text-[#C24D45];
}
</style>
