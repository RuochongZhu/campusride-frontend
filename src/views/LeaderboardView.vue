<template>
<div class="min-h-screen bg-[#EDEEE8] main-content pt-16">
  <div class="pt-8 px-4 max-w-7xl mx-auto">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-4">
        <router-link to="/" class="flex items-center text-[#C24D45] hover:text-[#A93C35] transition-colors">
          <span class="mr-2">‚Üê</span>
          <span class="font-medium">Back to Home</span>
        </router-link>
      </div>
      <h1 class="text-2xl font-bold text-[#333333]">Leaderboard</h1>
      <div class="flex items-center space-x-4">
        <select 
          v-model="timePeriod" 
          class="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
        <button 
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-sm transition-colors flex items-center"
          @click="refreshData"
        >
          <span :class="['mr-1', isRefreshing ? 'animate-spin' : '']">Ì¥Ñ</span>
          Refresh
        </button>
      </div>
    </div>

    <!-- Personal Ranking Card -->
    <div class="bg-gradient-to-r from-[#C24D45] to-[#63B5B7] p-1 rounded-lg mb-8">
      <div class="bg-white rounded-lg p-6 flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <img :src="currentUser.avatar" class="w-16 h-16 rounded-full border-4 border-[#C24D45]" />
          <div>
            <h3 class="text-xl font-bold text-[#333333]">{{ currentUser.name }}</h3>
            <p class="text-[#666666]">{{ currentUser.department }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-12">
          <div class="text-center">
            <p class="text-3xl font-bold text-[#C24D45]">{{ currentUser.points }}</p>
            <p class="text-sm text-[#666666]">Total Points</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center space-x-2">
              <p class="text-3xl font-bold text-[#333333]">#{{ currentUser.rank }}</p>
              <span :class="['text-2xl', currentUser.rankChange > 0 ? 'text-green-500' : 'text-red-500']">
                {{ currentUser.rankChange > 0 ? 'ÌøÜ' : 'Ì≥â' }}
              </span>
            </div>
            <p class="text-sm text-[#666666]">Current Rank</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 3 Winners Podium -->
    <div class="grid grid-cols-3 gap-6 mb-12">
      <div 
        v-for="winner in topWinners" 
        :key="winner.rank" 
        :class="['relative pt-12', 
                 winner.rank === 2 ? 'order-1' : 
                 winner.rank === 1 ? 'order-2' : 'order-3']"
      >
        <div class="bg-white rounded-lg p-4 text-center relative shadow-lg border-2"
             :class="winner.rank === 1 ? 'border-yellow-400' : 'border-gray-200'">
          <div class="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <img 
              :src="winner.avatar" 
              :class="['rounded-full border-4', 
                      winner.rank === 1 ? 'w-24 h-24 border-yellow-400' :
                      'w-20 h-20 border-gray-300']" 
            />
            <div 
              :class="['absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                      winner.rank === 1 ? 'bg-yellow-400' :
                      winner.rank === 2 ? 'bg-gray-400' : 'bg-orange-400']"
            >
              #{{ winner.rank }}
            </div>
          </div>
          <h3 class="font-bold text-lg mt-12 mb-1">{{ winner.name }}</h3>
          <p class="text-[#666666] text-sm mb-2">{{ winner.department }}</p>
          <p class="text-2xl font-bold text-[#C24D45]">{{ winner.points }} pts</p>
        </div>
      </div>
    </div>

    <!-- Rankings List -->
    <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
      <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h4 class="font-medium text-gray-900">Full Rankings</h4>
      </div>
      <div 
        v-for="(user, index) in rankings" 
        :key="user.id" 
        class="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
      >
        <div class="flex items-center space-x-4">
          <span class="w-8 text-center font-bold text-lg text-[#666666]">{{ index + 4 }}</span>
          <img :src="user.avatar" class="w-12 h-12 rounded-full" />
          <div>
            <h4 class="font-medium text-gray-900">{{ user.name }}</h4>
            <p class="text-sm text-[#666666]">{{ user.department }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-8">
          <div class="text-center">
            <p class="font-bold text-[#C24D45] text-lg">{{ user.points }}</p>
            <p class="text-sm text-[#666666]">Points</p>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="user.rankChange > 0" class="text-green-500">‚ÜóÔ∏è</span>
            <span v-else-if="user.rankChange < 0" class="text-red-500">‚ÜòÔ∏è</span>
            <span v-else class="text-gray-400">‚ûñ</span>
            <span 
              class="text-sm" 
              :class="user.rankChange > 0 ? 'text-green-500' : 
                      user.rankChange < 0 ? 'text-red-500' : 'text-gray-400'"
            >
              {{ Math.abs(user.rankChange) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'

const timePeriod = ref('week')
const isRefreshing = ref(false)

const currentUser = ref({
  name: 'Alexander Mitchell',
  department: 'Computer Science',
  points: 2850,
  rank: 5,
  rankChange: 2,
  avatar: 'https://public.readdy.ai/ai/img_res/34344f5c5a5a59c7f67e76e5fd3062b6.jpg'
})

const topWinners = ref([
  {
    rank: 1,
    name: 'Isabella Rodriguez',
    department: 'Business Analytics',
    points: 3450,
    avatar: 'https://public.readdy.ai/ai/img_res/fdf2cd9aa208e8cf18ce944b0519c14e.jpg'
  },
  {
    rank: 2,
    name: 'Benjamin Taylor',
    department: 'Environmental Science',
    points: 3200,
    avatar: 'https://public.readdy.ai/ai/img_res/a6bf7fdb1258422077a774b770df37d0.jpg'
  },
  {
    rank: 3,
    name: 'Sophia Chang',
    department: 'Data Science',
    points: 3100,
    avatar: 'https://public.readdy.ai/ai/img_res/f0f70d0a24f666b13ae89c45db93a711.jpg'
  }
])

const rankings = ref([
  {
    id: 4,
    name: 'William Anderson',
    department: 'Mechanical Engineering',
    points: 2950,
    rankChange: 1,
    avatar: 'https://public.readdy.ai/ai/img_res/85bd80873f4e375d7f940b48ed1b1f29.jpg'
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    department: 'Psychology',
    points: 2800,
    rankChange: -2,
    avatar: 'https://public.readdy.ai/ai/img_res/000b2ffe4c3d9d6a67786db96c55a534.jpg'
  }
])

const refreshData = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
    currentUser.value.points += Math.floor(Math.random() * 50)
  }, 1000)
}
</script>

<style scoped>
.main-content {
  flex: 1;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
