<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->

<template>
<div class="min-h-screen bg-[#EDEEE8]">
  <!-- Header -->
  <header class="fixed top-0 left-0 right-0 bg-[#EDEEE8] shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/b09167fc-39c6-4391-93f1-8dc9494513d9" data-readdy="true" class="flex items-center">
          <ArrowLeftOutlined class="mr-2 text-[#C24D45]" />
          <h1 class="text-3xl font-bold text-[#C24D45] tracking-wider" style="font-family: 'VT323', monospace;">CampusRide</h1>
        </a>
      </div>
      <div class="flex items-center space-x-4">
        <a-button-group>
          <a-button :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
            <template #icon><AppstoreOutlined /></template>
          </a-button>
          <a-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
            <template #icon><BarsOutlined /></template>
          </a-button>
        </a-button-group>
        <a-button type="primary" class="!rounded-button whitespace-nowrap" @click="showPostModal = true">
          <PlusOutlined /> Post Item
        </a-button>
      </div>
    </div>
  </header>

  <!-- Search and Filter Section -->
  <div class="pt-24 pb-6 bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col space-y-4">
        <div class="flex space-x-4">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="Search items..."
            class="max-w-xl"
            @search="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input-search>
          <a-button @click="showAdvancedFilter = !showAdvancedFilter">
            <FilterOutlined /> Filters
          </a-button>
        </div>

        <div class="flex space-x-2 overflow-x-auto pb-2">
          <a-tag 
            v-for="category in categories" 
            :key="category"
            :color="selectedCategory === category ? '#C24D45' : ''"
            class="cursor-pointer px-4 py-2"
            @click="selectedCategory = category"
          >
            {{ category }}
          </a-tag>
        </div>

        <div v-show="showAdvancedFilter" class="bg-[#EDEEE8] p-4 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-sm mb-2">Price Range</div>
              <a-slider
                v-model:value="priceRange"
                range
                :min="0"
                :max="2000"
                :step="10"
              />
            </div>
            <div>
              <div class="text-sm mb-2">Condition</div>
              <a-select
                v-model:value="condition"
                style="width: 100%"
                :options="[
                  { value: 'all', label: 'All' },
                  { value: 'new', label: 'New' },
                  { value: 'like-new', label: 'Like New' },
                  { value: 'used', label: 'Used' }
                ]"
              />
            </div>
            <div>
              <div class="text-sm mb-2">Sort By</div>
              <a-select
                v-model:value="sortBy"
                style="width: 100%"
                :options="[
                  { value: 'latest', label: 'Latest' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'popular', label: 'Most Popular' }
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Items Grid -->
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-4 gap-6' : 'space-y-4'">
        <div v-for="item in filteredItems" :key="item.id" 
          :class="viewMode === 'grid' ? 'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300' : 'bg-white rounded-lg shadow-sm p-4 flex space-x-4'">
          <div :class="viewMode === 'grid' ? '' : 'w-48 h-48 flex-shrink-0'">
            <img :src="item.image" :class="viewMode === 'grid' ? 'w-full h-48 object-cover' : 'w-full h-full object-cover rounded-lg'" />
          </div>
          <div :class="viewMode === 'grid' ? 'p-4' : 'flex-grow'">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-lg">{{ item.title }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ item.description }}</p>
              </div>
              <HeartOutlined 
                :class="item.favorited ? 'text-[#C24D45]' : 'text-gray-400'"
                class="text-xl cursor-pointer"
                @click="toggleFavorite(item)"
              />
            </div>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-xl font-bold text-[#C24D45]">${{ item.price }}</span>
              <div class="flex items-center space-x-1">
                <StarFilled class="text-[#F9D367]" />
                <span class="text-sm text-gray-500">{{ item.rating }}</span>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img :src="item.sellerAvatar" class="w-8 h-8 rounded-full" />
                <span class="text-sm text-gray-500">{{ item.sellerName }}</span>
              </div>
              <a-button type="primary" class="!rounded-button whitespace-nowrap" @click="openChat(item)">
                <MessageOutlined /> Message
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Post Item Modal -->
  <a-modal
    v-model:visible="showPostModal"
    title="Post New Item"
    @ok="handlePostItem"
    okText="Post"
    cancelText="Cancel"
    width="600px"
  >
    <div class="space-y-4">
      <a-input v-model:value="newItem.title" placeholder="Item Title" />
      <a-textarea v-model:value="newItem.description" placeholder="Description" :rows="4" />
      <a-input-number v-model:value="newItem.price" placeholder="Price" style="width: 100%" prefix="$" />
      <a-select v-model:value="newItem.category" style="width: 100%" placeholder="Select Category">
        <a-select-option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </a-select-option>
      </a-select>
      <a-select v-model:value="newItem.condition" style="width: 100%" placeholder="Select Condition">
        <a-select-option value="new">New</a-select-option>
        <a-select-option value="like-new">Like New</a-select-option>
        <a-select-option value="used">Used</a-select-option>
      </a-select>
    </div>
  </a-modal>
</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { 
  ArrowLeftOutlined,
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  HeartOutlined,
  StarFilled,
  MessageOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';

const viewMode = ref('grid');
const searchQuery = ref('');
const selectedCategory = ref('All');
const showAdvancedFilter = ref(false);
const priceRange = ref([0, 2000]);
const condition = ref('all');
const sortBy = ref('latest');
const showPostModal = ref(false);

const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Fashion', 'Sports', 'Art', 'Others'];

const newItem = ref({
  title: '',
  description: '',
  price: 0,
  category: '',
  condition: ''
});

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
  // Add more items as needed
]);

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'All' || item.category === selectedCategory.value;
    const matchesPrice = item.price >= priceRange.value[0] && item.price <= priceRange.value[1];
    const matchesCondition = condition.value === 'all' || item.condition === condition.value;
    return matchesSearch && matchesCategory && matchesPrice && matchesCondition;
  });
});

const handleSearch = () => {
  // Implement search logic
};

const toggleFavorite = (item: any) => {
  item.favorited = !item.favorited;
};

const openChat = (item: any) => {
  // Implement chat logic
};

const handlePostItem = () => {
  // Implement post item logic
  showPostModal.value = false;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

:deep(.ant-input-search-button) {
  height: 100%;
  background-color: #C24D45;
  border-color: #C24D45;
}

:deep(.ant-tag) {
  border-radius: 16px;
}

:deep(.ant-slider-track) {
  background-color: #C24D45;
}

:deep(.ant-slider-handle) {
  border-color: #C24D45;
}

:deep(.ant-btn-primary) {
  background-color: #C24D45;
  border-color: #C24D45;
}

:deep(.ant-btn-primary:hover) {
  background-color: #A93E37;
  border-color: #A93E37;
}
</style>

