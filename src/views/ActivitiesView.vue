<template>
  <div class="min-h-screen bg-[#EDEEE8] main-content pt-16">
    <div class="pt-8 pb-16 max-w-7xl mx-auto px-4">
      
      <!-- Groups Grid -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-[#333333] mb-6">Campus Groups</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="group in groups" 
            :key="group.id"
            class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-[#333333]">{{ group.name }}</h3>
              <span 
                :class="['px-2 py-1 rounded-full text-xs font-medium', group.category.color]"
              >
                {{ group.category.name }}
              </span>
            </div>
            <p class="text-sm text-[#666666] mb-4">{{ group.description }}</p>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <span class="mr-1">Ì±•</span>
                  <span>{{ group.members }} members</span>
                </div>
                <div class="flex items-center">
                  <span class="mr-1">‚è∞</span>
                  <span>{{ group.activeTime }}</span>
                </div>
              </div>
              <button 
                class="bg-[#C24D45] hover:bg-[#A93C35] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                @click="joinGroup(group)"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Feed Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div class="mb-4 md:mb-0">
                <div class="flex space-x-2">
                  <button
                    v-for="filter in feedFilters"
                    :key="filter"
                    :class="['px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    feedFilter === filter ? 'bg-[#C24D45] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                    @click="feedFilter = filter"
                  >
                    {{ filter }}
                  </button>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <span class="text-sm text-[#666666] mr-2">Distance:</span>
                  <input 
                    type="range" 
                    v-model="distanceFilter" 
                    min="500" 
                    max="5000" 
                    step="500" 
                    class="w-32"
                  />
                  <span class="text-sm text-[#666666] ml-2">{{ distanceFilter / 1000 }}km</span>
                </div>
                <select 
                  v-model="sortOption" 
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
                >
                  <option value="newest">Newest</option>
                  <option value="closest">Closest</option>
                  <option value="relevant">Most Relevant</option>
                </select>
              </div>
            </div>

            <!-- Activity Cards -->
            <div class="space-y-6">
              <div 
                v-for="activity in filteredActivities" 
                :key="activity.id"
                class="bg-[#FAFAFA] rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                @mouseenter="highlightRadarDot(activity.id)"
                @mouseleave="resetRadarDot()"
              >
                <div class="flex justify-between items-start">
                  <div class="flex space-x-3">
                    <img :src="activity.user.avatar" class="w-10 h-10 rounded-full" />
                    <div>
                      <div class="flex items-center space-x-2">
                        <h3 class="font-medium text-[#333333]">{{ activity.title }}</h3>
                        <span 
                          :class="['px-2 py-1 rounded-full text-xs font-medium', activity.category.color]"
                        >
                          {{ activity.category.name }}
                        </span>
                      </div>
                      <div class="flex items-center text-sm text-[#666666] space-x-2">
                        <span>{{ activity.user.name }}</span>
                        <span>‚Ä¢</span>
                        <span>{{ activity.group }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-sm text-[#666666]">{{ activity.timeAgo }}</div>
                </div>
                
                <p class="text-[#333333] my-3">{{ activity.description }}</p>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <span 
                    v-for="tag in activity.tags" 
                    :key="tag" 
                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between text-sm text-[#666666]">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                      <span class="mr-1">Ì≥ç</span>
                      <span>{{ activity.location }} ({{ activity.distance }})</span>
                    </div>
                    <div class="flex items-center">
                      <span class="mr-1">‚è∞</span>
                      <span>Expires in {{ activity.expiresIn }}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="mr-1">Ì±•</span>
                      <span>{{ activity.participants }} participating</span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        class="bg-green-500 h-1.5 rounded-full" 
                        :style="{ width: activity.successRate + '%' }"
                      ></div>
                    </div>
                    <span class="ml-1">{{ activity.successRate }}%</span>
                  </div>
                </div>
                
                <div class="flex justify-end space-x-2 mt-4">
                  <button 
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                    @click="sendMessage(activity)"
                  >
                    Ì≤¨ Message
                  </button>
                  <button 
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                    @click="shareActivity(activity)"
                  >
                    Ì≥§ Share
                  </button>
                  <button 
                    class="px-4 py-2 bg-[#C24D45] hover:bg-[#A93C35] text-white rounded-md text-sm font-medium transition-colors"
                    @click="joinActivity(activity)"
                  >
                    Ì±ç Interested
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="mt-6 flex justify-center">
              <div class="flex space-x-2">
                <button 
                  v-for="page in totalPages" 
                  :key="page"
                  :class="['px-3 py-2 rounded-md text-sm transition-colors',
                  currentPage === page ? 'bg-[#C24D45] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Nearby Radar Widget -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-[#333333]">Nearby Radar</h2>
              <button 
                class="text-[#C24D45] text-sm font-medium"
                @click="toggleMapExpand"
              >
                {{ isMapExpanded ? 'Collapse' : 'Expand' }}
              </button>
            </div>
            
            <div class="relative bg-[#F5F5F5] rounded-lg overflow-hidden mb-4 h-64">
              <img 
                :src="mapImage" 
                class="w-full h-full object-cover" 
                alt="Campus Map"
              />
              
              <!-- Radar Center Point -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full z-10"></div>
              
              <!-- Distance Rings -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-gray-400 rounded-full opacity-50"></div>
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-400 rounded-full opacity-50"></div>
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-gray-400 rounded-full opacity-50"></div>
              
              <!-- Activity Dots -->
              <div 
                v-for="dot in nearbyDots" 
                :key="dot.id"
                :class="['absolute rounded-full transition-all duration-300 cursor-pointer',
                dot.color,
                activeRadarDot === dot.id ? 'w-5 h-5 -translate-x-1 -translate-y-1' : 'w-3 h-3']"
                :style="{ top: dot.top + '%', left: dot.left + '%' }"
                @mouseenter="showDotInfo(dot)"
                @mouseleave="hideDotInfo()"
                @click="focusActivity(dot.activityId)"
              >
              </div>
              
              <!-- Activity Info Popup -->
              <div 
                v-if="hoveredDot"
                class="absolute bg-white p-2 rounded-lg shadow-lg text-sm z-10 max-w-xs pointer-events-none"
                :style="{
                  top: (hoveredDot.top - 10) + '%',
                  left: (hoveredDot.left + 5) + '%'
                }"
              >
                {{ hoveredDot.activityInfo }}
              </div>
            </div>

            <!-- Radar Legend -->
            <div class="flex justify-between text-sm text-[#666666]">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Offering Help</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Need Help</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                <span>Social</span>
              </div>
            </div>
          </div>

          <!-- Recent Successful Connections -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-medium text-[#333333] mb-4">Recent Connections</h2>
            <div class="space-y-4">
              <div 
                v-for="connection in recentConnections" 
                :key="connection.id" 
                class="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div class="flex items-center space-x-3 mb-2">
                  <img :src="connection.user1.avatar" class="w-8 h-8 rounded-full" />
                  <span class="text-[#333333] text-sm">{{ connection.user1.name }}</span>
                  <span class="text-[#666666]">+</span>
                  <img :src="connection.user2.avatar" class="w-8 h-8 rounded-full" />
                  <span class="text-[#333333] text-sm">{{ connection.user2.name }}</span>
                </div>
                <p class="text-sm text-[#666666] italic">"{{ connection.testimonial }}"</p>
              </div>
            </div>
            
            <!-- Activity Stats -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-xl font-bold text-[#C24D45]">{{ activityStats.studySessions }}</div>
                  <div class="text-xs text-[#666666]">Study sessions today</div>
                </div>
                <div>
                  <div class="text-xl font-bold text-[#C24D45]">{{ activityStats.helpRequests }}</div>
                  <div class="text-xs text-[#666666]">Help requests fulfilled</div>
                </div>
                <div>
                  <div class="text-xl font-bold text-[#C24D45]">{{ activityStats.newConnections }}</div>
                  <div class="text-xs text-[#666666]">New connections</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expanded Map Modal -->
      <div 
        v-if="isMapExpanded"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="isMapExpanded = false"
      >
        <div class="bg-white rounded-lg p-4 max-w-4xl w-full mx-4" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Nearby Radar - Expanded View</h3>
            <button 
              class="text-gray-500 hover:text-gray-700"
              @click="isMapExpanded = false"
            >
              ‚úï
            </button>
          </div>
          <div class="relative bg-[#F5F5F5] rounded-lg overflow-hidden" style="height: 600px;">
            <img :src="mapImage" class="w-full h-full object-cover" />
            
            <!-- Larger radar elements for expanded view -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full z-10"></div>
            
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-400 rounded-full opacity-50"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-gray-400 rounded-full opacity-50"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-120 h-120 border border-gray-400 rounded-full opacity-50"></div>
            
            <!-- Activity Dots -->
            <div 
              v-for="dot in nearbyDots" 
              :key="dot.id"
              :class="['absolute rounded-full transition-all duration-300',
              dot.color,
              'w-5 h-5']"
              :style="{ top: dot.top + '%', left: dot.left + '%' }"
              @mouseenter="showDotInfo(dot)"
              @mouseleave="hideDotInfo()"
            >
            </div>
            
            <!-- Expanded Activity Info Popup -->
            <div 
              v-if="hoveredDot"
              class="absolute bg-white p-3 rounded-lg shadow-lg text-sm z-10 max-w-sm"
              :style="{
                top: (hoveredDot.top - 10) + '%',
                left: (hoveredDot.left + 5) + '%'
              }"
            >
              {{ hoveredDot.activityInfo }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive data
const feedFilter = ref('All Activities')
const distanceFilter = ref(1000)
const sortOption = ref('newest')
const currentPage = ref(1)
const activeRadarDot = ref(null)
const isMapExpanded = ref(false)
const hoveredDot = ref(null)

// Filter options
const feedFilters = ['All Activities', 'My Groups', 'Urgent Needs']

// Groups data
const groups = ref([
  {
    id: 'cs5582',
    name: 'CS 5582 Study Group',
    category: { name: 'Academic', color: 'bg-blue-100 text-blue-800' },
    description: 'A collaborative group for CS 5582 students to discuss coursework, share resources, and prepare for exams together.',
    members: 45,
    activeTime: 'Very Active'
  },
  {
    id: 'rideshare',
    name: 'Campus Rideshare',
    category: { name: 'Transportation', color: 'bg-green-100 text-green-800' },
    description: 'Connect with fellow students for carpooling and ride-sharing to save money and reduce environmental impact.',
    members: 128,
    activeTime: 'Active'
  },
  {
    id: 'basketball',
    name: 'Basketball Club',
    category: { name: 'Sports', color: 'bg-orange-100 text-orange-800' },
    description: 'Join casual basketball games and tournaments. All skill levels welcome!',
    members: 76,
    activeTime: 'Very Active'
  },
  {
    id: 'debate',
    name: 'Debate Society',
    category: { name: 'Academic', color: 'bg-purple-100 text-purple-800' },
    description: 'Enhance your public speaking and critical thinking skills through structured debates and discussions.',
    members: 52,
    activeTime: 'Moderate'
  },
  {
    id: 'photography',
    name: 'Photography Club',
    category: { name: 'Arts', color: 'bg-cyan-100 text-cyan-800' },
    description: 'Share your passion for photography, learn new techniques, and participate in photo walks around campus.',
    members: 94,
    activeTime: 'Active'
  },
  {
    id: 'volunteer',
    name: 'Community Service',
    category: { name: 'Volunteer', color: 'bg-red-100 text-red-800' },
    description: 'Make a difference in our community through various volunteer opportunities and social initiatives.',
    members: 156,
    activeTime: 'Very Active'
  }
])

// Activities data
const activities = ref([
  {
    id: 1,
    title: 'Study Group for Midterm Exam',
    category: { name: 'Academic', color: 'bg-blue-100 text-blue-800' },
    user: {
      name: 'Alex Johnson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20male%20student%20with%20glasses%20wearing%20casual%20smart%20attire%20against%20neutral%20background&width=100&height=100&seq=2&orientation=squarish'
    },
    group: 'CS 5582 Study Group',
    timeAgo: '15 minutes ago',
    description: 'Looking for 3-4 people to join our study session for the upcoming midterm. We\'ll be focusing on chapters 5-8. I can help with the practical problems!',
    tags: ['Computer Science', 'Algorithms', 'Midterm'],
    location: 'Main Library',
    distance: '0.3 miles',
    expiresIn: '3 hours',
    participants: 4,
    successRate: 85
  },
  {
    id: 2,
    title: 'Need Help with Physics Assignment',
    category: { name: 'Help Needed', color: 'bg-red-100 text-red-800' },
    user: {
      name: 'Sophia Chen',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20female%20asian%20student%20with%20friendly%20smile%20wearing%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=3&orientation=squarish'
    },
    group: 'Physics 101',
    timeAgo: '45 minutes ago',
    description: 'Struggling with the quantum mechanics problems in this week\'s assignment. Would appreciate if someone could help explain the concepts.',
    tags: ['Physics', 'Quantum Mechanics', 'Homework'],
    location: 'Science Building',
    distance: '0.5 miles',
    expiresIn: '5 hours',
    participants: 2,
    successRate: 90
  },
  {
    id: 3,
    title: 'Basketball Pickup Game',
    category: { name: 'Social', color: 'bg-purple-100 text-purple-800' },
    user: {
      name: 'Marcus Williams',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20athletic%20young%20male%20student%20with%20friendly%20smile%20wearing%20sports%20attire%20against%20neutral%20background&width=100&height=100&seq=4&orientation=squarish'
    },
    group: 'Campus Sports',
    timeAgo: '1 hour ago',
    description: 'Organizing a casual basketball game this evening. All skill levels welcome! We need 4 more players to make full teams.',
    tags: ['Basketball', 'Sports', 'Recreation'],
    location: 'Recreation Center',
    distance: '0.8 miles',
    expiresIn: '4 hours',
    participants: 6,
    successRate: 95
  },
  {
    id: 4,
    title: 'Offering Free Tutoring in Calculus',
    category: { name: 'Offering Help', color: 'bg-green-100 text-green-800' },
    user: {
      name: 'Emily Parker',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20female%20student%20with%20glasses%20wearing%20smart%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=5&orientation=squarish'
    },
    group: 'Math Tutors',
    timeAgo: '2 hours ago',
    description: 'I\'m offering free tutoring sessions for Calculus I & II. I have 2 hours available this afternoon to help anyone struggling with derivatives, integrals, or application problems.',
    tags: ['Calculus', 'Math', 'Tutoring'],
    location: 'Student Union',
    distance: '0.2 miles',
    expiresIn: '2 hours',
    participants: 3,
    successRate: 98
  }
])

// Map data
const mapImage = 'https://readdy.ai/api/search-image?query=aerial%20view%20of%20university%20campus%20map%20with%20buildings%20paths%20and%20green%20spaces%20in%20a%20simple%20clean%20design%20style&width=400&height=300&seq=6&orientation=landscape'

const nearbyDots = ref([
  {
    id: 1,
    color: 'bg-green-500',
    top: 45,
    left: 55,
    activityInfo: 'Study Group for Midterm Exam - Looking for 3-4 people to join',
    activityId: 1
  },
  {
    id: 2,
    color: 'bg-red-500',
    top: 35,
    left: 60,
    activityInfo: 'Need Help with Physics Assignment - Quantum mechanics problems',
    activityId: 2
  },
  {
    id: 3,
    color: 'bg-red-500',
    top: 55,
    left: 40,
    activityInfo: 'Looking for Math Study Partner - Calculus II',
    activityId: null
  },
  {
    id: 4,
    color: 'bg-purple-500',
    top: 60,
    left: 65,
    activityInfo: 'Basketball Pickup Game - 4 spots available',
    activityId: 3
  },
  {
    id: 5,
    color: 'bg-green-500',
    top: 40,
    left: 35,
    activityInfo: 'Offering Free Tutoring - Calculus I & II',
    activityId: 4
  },
  {
    id: 6,
    color: 'bg-purple-500',
    top: 30,
    left: 45,
    activityInfo: 'Campus Photography Walk - Join us this afternoon',
    activityId: null
  },
  {
    id: 7,
    color: 'bg-green-500',
    top: 65,
    left: 55,
    activityInfo: 'Programming Help Available - Java & Python',
    activityId: null
  }
])

// Recent connections data
const recentConnections = ref([
  {
    id: 1,
    user1: {
      name: 'David Kim',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20asian%20male%20student%20with%20friendly%20smile%20wearing%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=7&orientation=squarish'
    },
    user2: {
      name: 'Jessica Lee',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20female%20student%20with%20long%20hair%20wearing%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=8&orientation=squarish'
    },
    testimonial: 'David helped me understand the complex algorithms. Great study session!'
  },
  {
    id: 2,
    user1: {
      name: 'Michael Brown',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20male%20student%20with%20beard%20wearing%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=9&orientation=squarish'
    },
    user2: {
      name: 'Sarah Johnson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20female%20student%20with%20short%20hair%20wearing%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=10&orientation=squarish'
    },
    testimonial: 'Found a great carpool partner for the semester. Saving money and the environment!'
  },
  {
    id: 3,
    user1: {
      name: 'Lisa Wang',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20asian%20female%20student%20with%20glasses%20wearing%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=11&orientation=squarish'
    },
    user2: {
      name: 'James Wilson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20male%20student%20with%20friendly%20smile%20wearing%20smart%20casual%20attire%20against%20neutral%20background&width=100&height=100&seq=12&orientation=squarish'
    },
    testimonial: 'Lisa\'s tutoring helped me ace my calculus exam. Highly recommended!'
  }
])

// Activity stats
const activityStats = ref({
  studySessions: 15,
  helpRequests: 28,
  newConnections: 42
})

// Computed properties
const filteredActivities = computed(() => {
  let filtered = activities.value

  if (feedFilter.value === 'My Groups') {
    filtered = filtered.filter(activity => activity.group.includes('CS 5582'))
  } else if (feedFilter.value === 'Urgent Needs') {
    filtered = filtered.filter(activity => activity.category.name === 'Help Needed')
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / 10) || 1
})

// Methods
const joinGroup = (group) => {
  alert(`Joined ${group.name}! You'll receive notifications about group activities.`)
}

const highlightRadarDot = (activityId) => {
  activeRadarDot.value = activityId
}

const resetRadarDot = () => {
  activeRadarDot.value = null
}

const toggleMapExpand = () => {
  isMapExpanded.value = !isMapExpanded.value
}

const showDotInfo = (dot) => {
  hoveredDot.value = dot
}

const hideDotInfo = () => {
  hoveredDot.value = null
}

const focusActivity = (activityId) => {
  if (activityId) {
    const element = document.querySelector(`[data-activity-id="${activityId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const sendMessage = (activity) => {
  alert(`Opening chat with ${activity.user.name}...`)
}

const shareActivity = (activity) => {
  navigator.share?.({
    title: activity.title,
    text: activity.description,
    url: window.location.href
  }).catch(() => {
    // Fallback for browsers that don't support navigator.share
    navigator.clipboard?.writeText(window.location.href)
    alert('Activity link copied to clipboard!')
  })
}

const joinActivity = (activity) => {
  alert(`Joined "${activity.title}"! The organizer will be notified.`)
  activity.participants++
}
</script>

<style scoped>
.main-content {
  flex: 1;
}

/* Custom slider styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #C24D45;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #C24D45;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Animation classes */
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}
</style>
