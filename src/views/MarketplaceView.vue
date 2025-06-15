<template>
<div class="min-h-screen bg-[#EDEEE8] main-content pt-16">
  
  <!-- Search and Filter Section -->
  <div class="pb-6 bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 pt-6">
      <div class="flex flex-col space-y-4">
        <div class="flex space-x-4">
          <div class="max-w-xl flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search items..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C24D45] focus:border-transparent"
              @keyup.enter="handleSearch"
            />
          </div>
          <button 
            @click="showAdvancedFilter = !showAdvancedFilter"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center"
          >
            Ì¥ç Filters
          </button>
          <div class="flex space-x-2">
            <button
              :class="['p-2 rounded-md transition-colors',
              viewMode === 'grid' ? 'bg-[#C24D45] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
              @click="viewMode = 'grid'"
            >
              ‚äû
            </button>
            <button
              :class="['p-2 rounded-md transition-colors',
              viewMode === 'list' ? 'bg-[#C24D45] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
              @click="viewMode = 'list'"
            >
              ‚ò∞
            </button>
          </div>
          <button 
            class="px-4 py-2 bg-[#C24D45] hover:bg-[#A93E37] text-white rounded-md font-medium transition-colors"
            @click="showPostModal = true"
          >
            + Post Item
          </button>
        </div>

        <!-- Category Tags -->
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <button
            v-for="category in categories" 
            :key="category"
            :class="['px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
            selectedCategory === category ? 'bg-[#C24D45] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <!-- Advanced Filters -->
        <div v-show="showAdvancedFilter" class="bg-[#EDEEE8] p-4 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-sm mb-2 font-medium">Price Range</div>
              <div class="flex items-center space-x-2">
                <input
                  type="number"
                  v-model="priceRange[0]"
                  placeholder="Min"
                  class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  v-model="priceRange[1]"
                  placeholder="Max"
                  class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div>
              <div class="text-sm mb-2 font-medium">Condition</div>
              <select
                v-model="condition"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
              >
                <option value="all">All Conditions</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div>
              <div class="text-sm mb-2 font-medium">Sort By</div>
              <select
                v-model="sortBy"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Items Grid/List -->
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-4 gap-6' : 'space-y-4'">
        <div 
          v-for="item in filteredItems" 
          :key="item.id" 
          :class="viewMode === 'grid' ? 
            'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer' : 
            'bg-white rounded-lg shadow-sm p-4 flex space-x-4 hover:shadow-md transition-shadow duration-300 cursor-pointer'"
          @click="openItemDetails(item)"
        >
          <div :class="viewMode === 'grid' ? '' : 'w-48 h-48 flex-shrink-0'">
            <img 
              :src="item.image" 
              :alt="item.title"
              :class="viewMode === 'grid' ? 'w-full h-48 object-cover' : 'w-full h-full object-cover rounded-lg'" 
            />
          </div>
          <div :class="viewMode === 'grid' ? 'p-4' : 'flex-grow'">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-lg text-gray-900 mb-1">{{ item.title }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ item.description }}</p>
                <div class="flex items-center space-x-2 mb-2">
                  <span :class="['px-2 py-1 rounded-full text-xs font-medium',
                    item.condition === 'new' ? 'bg-green-100 text-green-800' :
                    item.condition === 'like-new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800']">
                    {{ item.condition === 'like-new' ? 'Like New' : item.condition.charAt(0).toUpperCase() + item.condition.slice(1) }}
                  </span>
                  <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {{ item.category }}
                  </span>
                </div>
              </div>
              <button
                :class="['ml-2 p-2 rounded-full transition-colors',
                item.favorited ? 'text-[#C24D45] bg-red-50' : 'text-gray-400 hover:text-[#C24D45] hover:bg-red-50']"
                @click.stop="toggleFavorite(item)"
              >
                {{ item.favorited ? '‚ù§Ô∏è' : 'Ì¥ç' }}
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold text-[#C24D45]">${{ item.price }}</span>
              <div class="flex items-center space-x-1">
                <span class="text-yellow-400">‚≠ê</span>
                <span class="text-sm text-gray-500">{{ item.rating }}</span>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img :src="item.sellerAvatar" class="w-6 h-6 rounded-full" />
                <span class="text-sm text-gray-500">{{ item.sellerName }}</span>
              </div>
              <button 
                class="px-3 py-1 bg-[#C24D45] hover:bg-[#A93E37] text-white rounded-md text-sm font-medium transition-colors"
                @click.stop="openChat(item)"
              >
                Ì≤¨ Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">Ì≥¶</div>
        <h3 class="text-xl font-medium text-gray-600 mb-2">No items found</h3>
        <p class="text-gray-500">Try adjusting your search criteria or browse different categories</p>
      </div>
    </div>
  </div>

  <!-- Post Item Modal -->
  <div 
    v-if="showPostModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="showPostModal = false"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
      <h3 class="text-xl font-bold mb-4">Post New Item</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
          <input
            v-model="newItem.title"
            type="text"
            placeholder="Enter item title"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="newItem.description"
            placeholder="Describe your item"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              v-model="newItem.price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              v-model="newItem.condition"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="used">Used</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            v-model="newItem.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C24D45]"
          >
            <option value="">Select category</option>
            <option v-for="category in categories.slice(1)" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="flex space-x-3 mt-6">
          <button
            class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            @click="showPostModal = false"
          >
            Cancel
          </button>
          <button
            class="flex-1 px-4 py-2 bg-[#C24D45] hover:bg-[#A93C37] text-white rounded-md font-medium transition-colors"
            @click="handlePostItem"
          >
            Post Item
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State management
const viewMode = ref('grid')
const searchQuery = ref('')
const selectedCategory = ref('All')
const showAdvancedFilter = ref(false)
const priceRange = ref([0, 2000])
const condition = ref('all')
const sortBy = ref('latest')
const showPostModal = ref(false)

// Categories
const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Fashion', 'Sports', 'Art', 'Others']

// New item form
const newItem = ref({
  title: '',
  description: '',
  price: 0,
  category: '',
  condition: ''
})

// Sample items data
const items = ref([
  {
    id: 1,
    title: 'MacBook Pro M3 2024',
    description: 'Latest model, only used for 2 months. Perfect condition with original packaging.',
    price: 1599,
    rating: 4.8,
    category: 'Electronics',
    condition: 'like-new',
    favorited: false,
    sellerName: 'Michael Chen',
    sellerAvatar: 'https://public.readdy.ai/ai/img_res/539e6fa3fa12610ae42a7bcac135190f.jpg',
    image: 'https://public.readdy.ai/ai/img_res/550990d6396fe731a589085be79fcdd0.jpg'
  },
  {
    id: 2,
    title: 'Calculus Textbook Bundle',
    description: 'Complete set of calculus textbooks for Math 101-103.',
    price: 125,
    rating: 4.9,
    category: 'Books',
    condition: 'used',
    favorited: true,
    sellerName: 'Sarah Johnson',
    sellerAvatar: 'https://public.readdy.ai/ai/img_res/de2255ba37565d676e2c732b5dc5961c.jpg',
    image: 'https://public.readdy.ai/ai/img_res/55dfd7c25a4de7828a074200e5bf6faf.jpg'
  }
])

// Computed properties
const filteredItems = computed(() => {
  let filtered = items.value

  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(item => item.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const handleSearch = () => {
  console.log('Searching for:', searchQuery.value)
}

const toggleFavorite = (item) => {
  item.favorited = !item.favorited
}

const openChat = (item) => {
  alert(`Opening chat with ${item.sellerName} about "${item.title}"`)
}

const openItemDetails = (item) => {
  alert(`Viewing details for "${item.title}"`)
}

const handlePostItem = () => {
  if (!newItem.value.title || !newItem.value.price) {
    alert('Please fill in required fields')
    return
  }
  
  items.value.unshift({
    id: items.value.length + 1,
    ...newItem.value,
    rating: 5.0,
    favorited: false,
    sellerName: 'You',
    sellerAvatar: 'https://public.readdy.ai/ai/img_res/e488429cf1a5ca4e6366c8ee916e9030.jpg',
    image: 'https://public.readdy.ai/ai/img_res/550990d6396fe731a589085be79fcdd0.jpg'
  })

  newItem.value = { title: '', description: '', price: 0, category: '', condition: '' }
  showPostModal.value = false
  alert('Item posted successfully!')
}
</script>

<style scoped>
.main-content {
  flex: 1;
}
</style>
