<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
<div class="min-h-screen bg-[#EDEEE8]">
<!-- Header -->
<header class="fixed top-0 left-0 right-0 bg-[#F5F5F5] shadow-sm z-50">
<div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
<div class="flex items-center space-x-8">
<h1 class="text-2xl font-bold text-[#C24D45] font-['Roboto']">CampusRide</h1>
<nav class="flex items-center space-x-6">
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/b09167fc-39c6-4391-93f1-8dc9494513d9" class="text-[#333333] hover:text-[#C24D45] transition-colors duration-300">Home</a>
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/e25c2b77-2a56-45ff-9413-ac71e7694233" class="text-[#333333] hover:text-[#C24D45] transition-colors duration-300" data-readdy="true">Carpooling</a>
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/448b13fc-61f9-4e4e-a4c5-1600e0aee71f" class="text-[#333333] hover:text-[#C24D45] transition-colors duration-300">Marketplace</a>
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/434198c4-44c6-434f-8cd2-4649a9ae8a8f" class="text-[#333333] hover:text-[#C24D45] transition-colors duration-300">Leaderboard</a>
</nav>
</div>
<div class="flex items-center space-x-4">
<div class="relative cursor-pointer">
<BellOutlined class="text-xl text-[#333333] hover:text-[#C24D45]" />
<span class="absolute -top-1 -right-1 w-4 h-4 bg-[#C24D45] rounded-full text-white text-xs flex items-center justify-center">3</span>
</div>
<div class="flex items-center space-x-2 cursor-pointer">
<a-select v-model:value="userStatus" class="w-32 bg-transparent border-none text-[#333333]">
<a-select-option value="online">
<div class="flex items-center">
<div class="w-2 h-2 rounded-full bg-[#4ECDC4] mr-2"></div>
Online
</div>
</a-select-option>
<a-select-option value="invisible">
<div class="flex items-center">
<div class="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
Invisible
</div>
</a-select-option>
</a-select>
<img :src="userAvatar" class="w-8 h-8 rounded-full border-2 border-white" />
</div>
</div>
</div>
</header>
<div class="pt-24 pb-16 max-w-7xl mx-auto px-4">
<!-- Groups Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div v-for="group in groups" :key="group.id"
class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all cursor-pointer">
<div class="flex items-center justify-between mb-4">
<h3 class="text-lg font-medium text-[#333333]">{{ group.name }}</h3>
<a-tag :color="group.category.color">{{ group.category.name }}</a-tag>
</div>
<p class="text-sm text-[#666666] mb-4">{{ group.description }}</p>
<div class="flex items-center justify-between text-sm">
<div class="flex items-center space-x-4">
<div class="flex items-center">
<TeamOutlined class="mr-1" />
<span>{{ group.members }} members</span>
</div>
<div class="flex items-center">
<ClockCircleOutlined class="mr-1" />
<span>{{ group.activeTime }}</span>
</div>
</div>
<a-button type="primary" class="!rounded-button bg-[#C24D45] border-none hover:bg-[#A93C35] whitespace-nowrap">
Join Group
</a-button>
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
<a-radio-group v-model:value="feedFilter" button-style="solid">
<a-radio-button value="all">All Activities</a-radio-button>
<a-radio-button value="groups">My Groups</a-radio-button>
<a-radio-button value="urgent">Urgent Needs</a-radio-button>
</a-radio-group>
</div>
<div class="flex items-center space-x-4">
<div class="flex items-center">
<span class="text-sm text-[#666666] mr-2">Distance:</span>
<a-slider v-model:value="distanceFilter" :min="500" :max="5000" :step="500" class="w-32" />
<span class="text-sm text-[#666666] ml-2">{{ distanceFilter / 1000 }}km</span>
</div>
<a-select v-model:value="sortOption" class="w-32">
<a-select-option value="newest">Newest</a-select-option>
<a-select-option value="closest">Closest</a-select-option>
<a-select-option value="relevant">Most Relevant</a-select-option>
</a-select>
</div>
</div>
<!-- Activity Cards -->
<div class="space-y-6">
<div v-for="activity in activities" :key="activity.id"
class="bg-[#FAFAFA] rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
@mouseenter="highlightRadarDot(activity.id)"
@mouseleave="resetRadarDot()">
<div class="flex justify-between items-start">
<div class="flex space-x-3">
<img :src="activity.user.avatar" class="w-10 h-10 rounded-full" />
<div>
<div class="flex items-center space-x-2">
<h3 class="font-medium text-[#333333]">{{ activity.title }}</h3>
<a-tag :color="activity.category.color">{{ activity.category.name }}</a-tag>
</div>
<div class="flex items-center text-sm text-[#666666] space-x-2">
<span>{{ activity.user.name }}</span>
<span>•</span>
<span>{{ activity.group }}</span>
</div>
</div>
</div>
<div class="text-sm text-[#666666]">{{ activity.timeAgo }}</div>
</div>
<p class="text-[#333333] my-3">{{ activity.description }}</p>
<div class="flex flex-wrap gap-2 mb-3">
<a-tag v-for="tag in activity.tags" :key="tag" color="blue">{{ tag }}</a-tag>
</div>
<div class="flex items-center justify-between text-sm text-[#666666]">
<div class="flex items-center space-x-4">
<div class="flex items-center">
<EnvironmentOutlined class="mr-1" />
<span>{{ activity.location }} ({{ activity.distance }})</span>
</div>
<div class="flex items-center">
<ClockCircleOutlined class="mr-1" />
<span>Expires in {{ activity.expiresIn }}</span>
</div>
<div class="flex items-center">
<TeamOutlined class="mr-1" />
<span>{{ activity.participants }} participating</span>
</div>
</div>
<div class="flex items-center">
<div class="w-16 bg-gray-200 rounded-full h-1.5">
<div class="bg-green-500 h-1.5 rounded-full" :style="{ width: activity.successRate + '%' }"></div>
</div>
<span class="ml-1">{{ activity.successRate }}%</span>
</div>
</div>
<div class="flex justify-end space-x-2 mt-4">
<a-button class="!rounded-button whitespace-nowrap">
<MessageOutlined /> Message
</a-button>
<a-button class="!rounded-button whitespace-nowrap">
<ShareAltOutlined /> Share
</a-button>
<a-button type="primary" class="!rounded-button bg-[#C24D45] border-none hover:bg-[#A93C35] whitespace-nowrap">
<LikeOutlined /> Interested
</a-button>
</div>
</div>
</div>
<div class="mt-6 flex justify-center">
<a-pagination v-model:current="currentPage" :total="50" />
</div>
</div>
</div>
<div class="space-y-6">
<!-- Nearby Radar Widget -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-center mb-4">
<h2 class="text-lg font-medium text-[#333333]">Nearby Radar</h2>
<a-button type="link" class="text-[#C24D45]" @click="toggleMapExpand">{{ isMapExpanded ? 'Collapse' : 'Expand' }}</a-button>
</div>
<div class="relative bg-[#F5F5F5] rounded-lg overflow-hidden mb-4 h-64">
<img :src="mapImage" class="w-full h-full object-cover" />
<!-- Radar Dots -->
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full z-10"></div>
<!-- Distance Rings -->
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-gray-400 rounded-full opacity-50"></div>
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-400 rounded-full opacity-50"></div>
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-gray-400 rounded-full opacity-50"></div>
<!-- Activity Dots -->
<div v-for="dot in nearbyDots" :key="dot.id"
class="absolute rounded-full transition-all duration-300"
:class="[
dot.color,
activeRadarDot === dot.id ? 'w-5 h-5 -translate-x-1 -translate-y-1' : 'w-3 h-3',
]"
:style="{ top: dot.top + '%', left: dot.left + '%' }"
@mouseenter="showDotInfo(dot)"
@mouseleave="hideDotInfo()">
</div>
<!-- Activity Info Popup -->
<div v-if="hoveredDot"
class="absolute bg-white p-2 rounded-lg shadow-lg text-sm z-10 max-w-xs"
:style="{
top: (hoveredDot.top - 10) + '%',
left: (hoveredDot.left + 5) + '%'
}">
{{ hoveredDot.activityInfo }}
</div>
</div>
<!-- Radar Modal -->
<a-modal
v-model:visible="isMapExpanded"
title="Nearby Radar"
:footer="null"
width="800px"
class="radar-modal"
>
<div class="relative bg-[#F5F5F5] rounded-lg overflow-hidden" style="height: 600px;">
<img :src="mapImage" class="w-full h-full object-cover" />
<!-- Radar Dots -->
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full z-10"></div>
<!-- Distance Rings -->
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-400 rounded-full opacity-50"></div>
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-gray-400 rounded-full opacity-50"></div>
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-120 h-120 border border-gray-400 rounded-full opacity-50"></div>
<!-- Activity Dots -->
<div v-for="dot in nearbyDots" :key="dot.id"
class="absolute rounded-full transition-all duration-300"
:class="[
dot.color,
activeRadarDot === dot.id ? 'w-8 h-8 -translate-x-2 -translate-y-2' : 'w-5 h-5',
]"
:style="{ top: dot.top + '%', left: dot.left + '%' }"
@mouseenter="showDotInfo(dot)"
@mouseleave="hideDotInfo()">
</div>
<!-- Activity Info Popup -->
<div v-if="hoveredDot"
class="absolute bg-white p-3 rounded-lg shadow-lg text-sm z-10 max-w-sm"
:style="{
top: (hoveredDot.top - 10) + '%',
left: (hoveredDot.left + 5) + '%'
}">
{{ hoveredDot.activityInfo }}
</div>
</div>
</a-modal>
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
<div v-for="connection in recentConnections" :key="connection.id" class="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
<div class="flex items-center space-x-3 mb-2">
<img :src="connection.user1.avatar" class="w-8 h-8 rounded-full" />
<span class="text-[#333333]">{{ connection.user1.name }}</span>
<span class="text-[#666666]">+</span>
<img :src="connection.user2.avatar" class="w-8 h-8 rounded-full" />
<span class="text-[#333333]">{{ connection.user2.name }}</span>
</div>
<p class="text-sm text-[#666666]">"{{ connection.testimonial }}"</p>
</div>
</div>
<div class="mt-4 pt-4 border-t border-gray-100">
<div class="grid grid-cols-3 gap-4 text-center">
<div>
<div class="text-xl font-bold text-[#C24D45]">15</div>
<div class="text-xs text-[#666666]">Study sessions today</div>
</div>
<div>
<div class="text-xl font-bold text-[#C24D45]">28</div>
<div class="text-xs text-[#666666]">Help requests fulfilled</div>
</div>
<div>
<div class="text-xl font-bold text-[#C24D45]">42</div>
<div class="text-xs text-[#666666]">New connections</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import {
BellOutlined,
EnvironmentOutlined,
ClockCircleOutlined,
TeamOutlined,
MessageOutlined,
ShareAltOutlined,
LikeOutlined
} from '@ant-design/icons-vue';
import { Modal as AModal } from 'ant-design-vue';
const userStatus = ref('available');
const userAvatar = 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20college%20student%20with%20friendly%20smile%20wearing%20casual%20attire%20against%20neutral%20background%20perfect%20for%20profile%20picture&width=100&height=100&seq=1&orientation=squarish';
// Quick Status Update Panel
const selectedGroup = ref('cs5582');
const statusTemplate = ref('');
const statusText = ref('');
const statusDuration = ref('1h');
const useCurrentLocation = ref(true);
const selectedLocation = ref('');
const groups = [
{
id: 'cs5582',
name: 'CS 5582 Study Group',
category: { name: 'Academic', color: 'blue' },
description: 'A collaborative group for CS 5582 students to discuss coursework, share resources, and prepare for exams together.',
members: 45,
activeTime: 'Very Active'
},
{
id: 'rideshare',
name: 'Campus Rideshare',
category: { name: 'Transportation', color: 'green' },
description: 'Connect with fellow students for carpooling and ride-sharing to save money and reduce environmental impact.',
members: 128,
activeTime: 'Active'
},
{
id: 'basketball',
name: 'Basketball Club',
category: { name: 'Sports', color: 'orange' },
description: 'Join casual basketball games and tournaments. All skill levels welcome!',
members: 76,
activeTime: 'Very Active'
},
{
id: 'debate',
name: 'Debate Society',
category: { name: 'Academic', color: 'purple' },
description: 'Enhance your public speaking and critical thinking skills through structured debates and discussions.',
members: 52,
activeTime: 'Moderate'
},
{
id: 'photography',
name: 'Photography Club',
category: { name: 'Arts', color: 'cyan' },
description: 'Share your passion for photography, learn new techniques, and participate in photo walks around campus.',
members: 94,
activeTime: 'Active'
},
{
id: 'volunteer',
name: 'Community Service',
category: { name: 'Volunteer', color: 'red' },
description: 'Make a difference in our community through various volunteer opportunities and social initiatives.',
members: 156,
activeTime: 'Very Active'
}
];
const statusTemplates = [
{ id: 'study', name: 'Looking for study partners' },
{ id: 'help', name: 'Need help with assignment' },
{ id: 'offer', name: 'Offering tutoring' },
{ id: 'social', name: 'Planning social event' }
];
const durations = [
{ value: '30m', label: '30 minutes' },
{ value: '1h', label: '1 hour' },
{ value: '2h', label: '2 hours' },
{ value: '4h', label: '4 hours' },
{ value: '8h', label: '8 hours' },
{ value: '1d', label: '1 day' }
];
const locations = [
{ id: 'library', name: 'Main Library' },
{ id: 'union', name: 'Student Union' },
{ id: 'science', name: 'Science Building' },
{ id: 'cafe', name: 'Campus Cafe' },
{ id: 'gym', name: 'Recreation Center' }
];
// Activity Feed Section
const feedFilter = ref('all');
const distanceFilter = ref(1000);
const sortOption = ref('newest');
const currentPage = ref(1);
const activities = [
{
id: 1,
title: 'Study Group for Midterm Exam',
category: { name: 'Academic', color: 'blue' },
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
category: { name: 'Help Needed', color: 'red' },
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
category: { name: 'Social', color: 'purple' },
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
category: { name: 'Offering Help', color: 'green' },
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
];
// Nearby Radar Widget
const mapImage = 'https://readdy.ai/api/search-image?query=aerial%20view%20of%20university%20campus%20map%20with%20buildings%20paths%20and%20green%20spaces%20in%20a%20simple%20clean%20design%20style&width=400&height=300&seq=6&orientation=landscape';
const activeRadarDot = ref(null);
const isMapExpanded = ref(false);
const hoveredDot = ref(null);
const nearbyDots = [
{
id: 1,
color: 'bg-green-500',
top: 45,
left: 55,
activityInfo: 'Study Group for Midterm Exam - Looking for 3-4 people to join'
},
{
id: 2,
color: 'bg-red-500',
top: 35,
left: 60,
activityInfo: 'Need Help with Physics Assignment - Quantum mechanics problems'
},
{
id: 3,
color: 'bg-red-500',
top: 55,
left: 40,
activityInfo: 'Looking for Math Study Partner - Calculus II'
},
{
id: 4,
color: 'bg-purple-500',
top: 60,
left: 65,
activityInfo: 'Basketball Pickup Game - 4 spots available'
},
{
id: 5,
color: 'bg-green-500',
top: 40,
left: 35,
activityInfo: 'Offering Free Tutoring - Calculus I & II'
},
{
id: 6,
color: 'bg-purple-500',
top: 30,
left: 45,
activityInfo: 'Campus Photography Walk - Join us this afternoon'
},
{
id: 7,
color: 'bg-green-500',
top: 65,
left: 55,
activityInfo: 'Programming Help Available - Java & Python'
}
];
const highlightRadarDot = (activityId) => {
activeRadarDot.value = activityId;
};
const resetRadarDot = () => {
activeRadarDot.value = null;
};
const toggleMapExpand = () => {
isMapExpanded.value = !isMapExpanded.value;
};
const showDotInfo = (dot) => {
hoveredDot.value = dot;
};
const hideDotInfo = () => {
hoveredDot.value = null;
};
// Recent Successful Connections
const recentConnections = [
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
];
</script>
<style scoped>
.nav-link {
@apply text-[#666666] hover:text-[#C24D45] font-medium relative px-2 py-1;
}
.nav-link::after {
content: '';
position: absolute;
width: 0;
height: 2px;
bottom: -4px;
left: 0;
background-color: #C24D45;
transition: width 0.3s ease;
}
.nav-link:hover::after {
width: 100%;
}
.nav-link.active {
@apply text-[#C24D45];
}
.nav-link.active::after {
width: 100%;
}
</style>
