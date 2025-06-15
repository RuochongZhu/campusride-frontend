<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
<div class="min-h-screen bg-gray-50">
<!-- Header -->
<header class="bg-white shadow-sm">
<div class="container mx-auto px-4 py-2 flex items-center">
<div class="flex items-center">
<a href="#" class="text-xl font-medium text-red-600 mr-12">CampusRide</a>
<nav class="flex space-x-8">
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/b09167fc-39c6-4391-93f1-8dc9494513d9" class="text-gray-600 hover:text-gray-900 font-medium">Home</a>
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/1543ff7a-b117-4d1c-9e42-462db056a890" class="text-gray-900 font-medium">Activity</a>
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/448b13fc-61f9-4e4e-a4c5-1600e0aee71f" class="text-gray-600 hover:text-gray-900 font-medium">Marketplace</a>
<a href="https://readdy.ai/home/7052541b-09e2-4468-9b64-d935f2cf9437/434198c4-44c6-434f-8cd2-4649a9ae8a8" class="text-gray-600 hover:text-gray-900 font-medium">Leaderboard</a>
</nav>
</div>
<div class="flex items-center space-x-4">
<div class="relative">
<a-input-search
placeholder="Search rides or locations"
class="w-48 md:w-64"
@search="onSearch"
/>
</div>
<div class="flex items-center space-x-4">
<div class="flex items-center bg-gray-100 rounded-full p-1">
<button
:class="['px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap !rounded-button',
userMode === 'passenger' ? 'bg-red-600 text-white' : 'text-gray-600']"
@click="userMode = 'passenger'"
>
Passenger
</button>
<button
:class="['px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap !rounded-button',
userMode === 'driver' ? 'bg-red-600 text-white' : 'text-gray-600']"
@click="userMode = 'driver'"
>
Driver
</button>
</div>
<div class="flex items-center space-x-2">
<a-tooltip title="Cornell Verified">
<div class="flex items-center bg-green-100 rounded-full px-3 py-1">
<safety-certificate-outlined class="text-green-600 mr-1" />
<span class="text-sm text-green-600 font-medium">Cornell Verified</span>
</div>
</a-tooltip>
<a-tooltip title="Two-Way Rating System">
<div class="flex items-center bg-blue-100 rounded-full px-3 py-1">
<star-filled class="text-blue-600 mr-1" />
<span class="text-sm text-blue-600 font-medium">Two-Way Rating</span>
</div>
</a-tooltip>
<a-tooltip title="Verified Driver History">
<div class="flex items-center bg-purple-100 rounded-full px-3 py-1 cursor-pointer" @click="showDriverHistory = true">
<history-outlined class="text-purple-600 mr-1" />
<span class="text-sm text-purple-600 font-medium">Driver History (150+ Rides)</span>
</div>
<!-- Driver History Modal -->
<a-modal
v-model:visible="showDriverHistory"
title="Driver History"
width="700px"
@ok="showDriverHistory = false"
>
<div class="space-y-6">
<!-- Summary Stats -->
<div class="grid grid-cols-3 gap-4">
<div class="bg-gray-50 p-4 rounded-lg text-center">
<div class="text-2xl font-bold text-purple-600">156</div>
<div class="text-gray-600">Total Rides</div>
</div>
<div class="bg-gray-50 p-4 rounded-lg text-center">
<div class="text-2xl font-bold text-green-600">4.9</div>
<div class="text-gray-600">Avg Rating</div>
</div>
<div class="bg-gray-50 p-4 rounded-lg text-center">
<div class="text-2xl font-bold text-blue-600">15,000+</div>
<div class="text-gray-600">Miles Driven</div>
</div>
</div>
<!-- Driving Record -->
<div>
<h3 class="font-bold text-lg mb-3">Driving Record</h3>
<div class="bg-gray-50 p-4 rounded-lg">
<div class="flex justify-between items-center mb-3">
<span class="text-gray-600">Safe Driving Score</span>
<span class="font-bold text-green-600">98%</span>
</div>
<div class="flex justify-between items-center mb-3">
<span class="text-gray-600">On-time Arrival Rate</span>
<span class="font-bold text-green-600">95%</span>
</div>
<div class="flex justify-between items-center">
<span class="text-gray-600">Cancellation Rate</span>
<span class="font-bold text-green-600">< 1%</span>
</div>
</div>
</div>
<!-- Vehicle Usage History -->
<div>
<h3 class="font-bold text-lg mb-3">Vehicle Usage History</h3>
<div class="space-y-3">
<div class="bg-gray-50 p-4 rounded-lg">
<div class="flex justify-between items-center">
<div>
<div class="font-medium">Tesla Model 3</div>
<div class="text-sm text-gray-500">Current Vehicle</div>
</div>
<div class="text-right">
<div class="font-medium text-green-600">8,500 miles</div>
<div class="text-sm text-gray-500">Last 12 months</div>
</div>
</div>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<div class="flex justify-between items-center">
<div>
<div class="font-medium">Toyota Camry</div>
<div class="text-sm text-gray-500">Previous Vehicle</div>
</div>
<div class="text-right">
<div class="font-medium text-gray-600">6,500 miles</div>
<div class="text-sm text-gray-500">2023 - 2024</div>
</div>
</div>
</div>
</div>
</div>
<!-- Recent Activity -->
<div>
<h3 class="font-bold text-lg mb-3">Recent Activity</h3>
<div class="space-y-2">
<div v-for="(activity, index) in recentActivities" :key="index" class="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
<div>
<div class="font-medium">{{ activity.route }}</div>
<div class="text-sm text-gray-500">{{ activity.date }}</div>
</div>
<div class="flex items-center">
<star-filled class="text-yellow-400 mr-1" />
<span>{{ activity.rating }}</span>
</div>
</div>
</div>
</div>
</div>
</a-modal>
</a-tooltip>
</div>
</div>
<div class="relative">
<a-badge count="3" :count="unreadCount">
<bell-outlined class="text-xl text-gray-600 cursor-pointer" @click="toggleNotifications" />
</a-badge>
<!-- Notification Panel -->
<div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
<div class="p-4 border-b">
<div class="flex justify-between items-center">
<h3 class="font-semibold">Notifications</h3>
<button @click="markAllAsRead" class="text-sm text-red-600 hover:text-red-700">Mark all as read</button>
</div>
</div>
<div class="max-h-96 overflow-y-auto">
<div v-for="notification in notifications" :key="notification.id" 
    class="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
    @click="viewNotificationDetails(notification.id)">
    <div class="flex items-start">
        <div :class="[
            'w-2 h-2 rounded-full mt-2 mr-3',
            notification.read ? 'bg-gray-300' : 'bg-red-600'
        ]"></div>
        <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
                <span class="font-medium text-sm" :class="notification.read ? 'text-gray-600' : 'text-gray-900'">
                    {{ notification.type }}
                </span>
                <span class="text-xs text-gray-500">{{ notification.timestamp }}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{ notification.content }}</p>
            <button @click.stop="markAsRead(notification.id)" 
                v-if="!notification.read"
                class="text-xs text-red-600 hover:text-red-700">
                Mark as read
            </button>
        </div>
    </div>
</div>
</div>
<div class="p-3 text-center border-t">
    <a href="#" class="text-sm text-red-600 hover:text-red-700">View all notifications</a>
</div>
</div>
</div>
<div class="flex items-center">
<a-avatar src="https://public.readdy.ai/ai/img_res/e488429cf1a5ca4e6366c8ee916e9030.jpg" />
</div>
</div>
</div>
</header>
<!-- Main Content -->
<main class="container mx-auto px-4 py-8">
<!-- Hero Section -->
<div class="relative rounded-xl overflow-hidden mb-12" style="min-height: 400px;">
<div class="absolute inset-0 bg-gradient-to-r from-red-900/90 to-transparent z-10"></div>
<img
src="https://public.readdy.ai/ai/img_res/200804c4fc3d12ef039423316cbf6d11.jpg"
alt="Rideshare experience"
class="absolute inset-0 w-full h-full object-cover"
/>
<div class="relative z-20 flex flex-col justify-center h-full max-w-2xl p-8 text-white">
<h1 class="text-4xl md:text-5xl font-bold mb-4">Share Your Journey</h1>
<p class="text-xl mb-6">Connect with drivers and passengers for a more affordable, sustainable, and social way to travel.</p>
</div>
</div>
<!-- Main Booking and Ride Sections -->
<div class="flex flex-col lg:flex-row gap-8">
<!-- Left Panel - Passenger Booking -->
<div class="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-6 h-fit">
<h2 class="text-2xl font-bold mb-6">{{ userMode === 'passenger' ? 'Book a Ride' : 'Post a Trip' }}</h2>
<!-- Category Filter -->
<div class="mb-6">
<label class="block text-gray-700 mb-3">Trip Category</label>
<div class="grid grid-cols-2 gap-3">
<button
v-for="category in tripCategories"
:key="category.id"
:class="['flex items-center justify-center p-3 rounded-lg border transition-all whitespace-nowrap !rounded-button',
selectedCategory === category.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 hover:border-red-600 hover:bg-red-50']"
@click="selectedCategory = category.id"
>
<component :is="category.icon" class="mr-2" />
<span>{{ category.name }}</span>
</button>
</div>
</div>
<!-- Passenger Form -->
<div v-if="userMode === 'passenger'">
<div class="mb-4">
<label class="block text-gray-700 mb-2">Origin</label>
<a-input
v-model:value="passengerForm.origin"
placeholder="Enter pickup location"
class="rounded-md border-gray-300"
>
<template #prefix>
<environment-outlined />
</template>
</a-input>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Destination</label>
<a-input
v-model:value="passengerForm.destination"
placeholder="Enter destination"
class="rounded-md border-gray-300"
>
<template #prefix>
<aim-outlined />
</template>
</a-input>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Date & Time</label>
<a-date-picker
v-model:value="passengerForm.date"
class="w-full rounded-md border-gray-300"
:disabledDate="disabledDate"
format="YYYY-MM-DD"
/>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Time</label>
<a-time-picker
v-model:value="passengerForm.time"
class="w-full rounded-md border-gray-300"
format="HH:mm"
/>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Passengers</label>
<a-input-number
v-model:value="passengerForm.passengers"
:min="1"
:max="8"
class="w-full rounded-md border-gray-300"
/>
</div>
<div class="mb-6">
<label class="block text-gray-700 mb-2">Special Requirements</label>
<a-textarea
v-model:value="passengerForm.requirements"
placeholder="Luggage, pets, etc."
:rows="3"
class="rounded-md border-gray-300"
/>
</div>
<div class="bg-gray-50 p-4 rounded-lg mb-6">
<div class="flex justify-between mb-2">
<span class="text-gray-600">Estimated Price:</span>
<span class="font-semibold">${{ estimatedPrice }}</span>
</div>
<div class="flex justify-between">
<span class="text-gray-600">Estimated Duration:</span>
<span class="font-semibold">{{ estimatedDuration }}</span>
</div>
</div>
<div class="mb-6">
<label class="block text-gray-700 mb-3">Payment Method</label>
<div class="flex space-x-4">
<div
:class="['flex items-center p-3 border rounded-md cursor-pointer',
passengerForm.paymentMethod === 'online' ? 'border-red-600 bg-red-50' : 'border-gray-300']"
@click="passengerForm.paymentMethod = 'online'"
>
<credit-card-outlined class="text-red-600 mr-2" />
<span>Pay Online</span>
</div>
<div
:class="['flex items-center p-3 border rounded-md cursor-pointer',
passengerForm.paymentMethod === 'cash' ? 'border-red-600 bg-red-50' : 'border-gray-300']"
@click="passengerForm.paymentMethod = 'cash'"
>
<dollar-outlined class="text-red-600 mr-2" />
<span>Pay Cash</span>
</div>
</div>
</div>
<button class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-all whitespace-nowrap !rounded-button cursor-pointer">
Find Rides
</button>
</div>
<!-- Driver Form -->
<div v-else>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Origin</label>
<a-input
v-model:value="driverForm.origin"
placeholder="Enter starting point"
class="rounded-md border-gray-300"
>
<template #prefix>
<environment-outlined />
</template>
</a-input>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Destination</label>
<a-input
v-model:value="driverForm.destination"
placeholder="Enter destination"
class="rounded-md border-gray-300"
>
<template #prefix>
<aim-outlined />
</template>
</a-input>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Date</label>
<a-date-picker
v-model:value="driverForm.date"
class="w-full rounded-md border-gray-300"
:disabledDate="disabledDate"
format="YYYY-MM-DD"
/>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Departure Time</label>
<a-time-picker
v-model:value="driverForm.time"
class="w-full rounded-md border-gray-300"
format="HH:mm"
/>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Available Seats</label>
<a-input-number
v-model:value="driverForm.seats"
:min="1"
:max="8"
class="w-full rounded-md border-gray-300"
/>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Price per Seat ($)</label>
<a-input-number
v-model:value="driverForm.price"
:min="1"
class="w-full rounded-md border-gray-300"
:formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
:parser="value => value.replace(/\$\s?|(,*)/g, '')"
/>
</div>
<div class="mb-4">
<label class="block text-gray-700 mb-2">Vehicle</label>
<a-select
v-model:value="driverForm.vehicle"
class="w-full rounded-md border-gray-300"
placeholder="Select your vehicle"
>
<a-select-option value="sedan">Sedan</a-select-option>
<a-select-option value="suv">SUV</a-select-option>
<a-select-option value="van">Van</a-select-option>
<a-select-option value="truck">Truck</a-select-option>
</a-select>
</div>
<div class="mb-6">
<label class="block text-gray-700 mb-2">Additional Notes</label>
<a-textarea
v-model:value="driverForm.notes"
placeholder="Luggage space, pet policy, etc."
:rows="3"
class="rounded-md border-gray-300"
/>
</div>
<div class="mb-6">
<label class="block text-gray-700 mb-3">Upload Vehicle Photo</label>
<a-upload-dragger
v-model:fileList="fileList"
name="file"
action="/upload"
class="w-full"
>
<p class="ant-upload-drag-icon">
<inbox-outlined />
</p>
<p class="ant-upload-text">Click or drag file to this area to upload</p>
<p class="ant-upload-hint">
Support for a single upload. Vehicle photo must be clear and recent.
</p>
</a-upload-dragger>
</div>
<button class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-all whitespace-nowrap !rounded-button cursor-pointer">
Post Trip
</button>
</div>
</div>
<!-- Right Panel - Available Rides -->
<div class="w-full lg:w-2/3">
<div class="bg-white rounded-xl shadow-lg p-6 mb-6">
<div class="flex justify-between items-center mb-6">
<h2 class="text-2xl font-bold">Available Rides</h2>
<div class="flex items-center">
<span class="mr-2 text-gray-600">Sort by:</span>
<a-select
v-model:value="sortBy"
style="width: 120px"
class="rounded-md"
>
<a-select-option value="price">Price</a-select-option>
<a-select-option value="time">Departure Time</a-select-option>
<a-select-option value="rating">Driver Rating</a-select-option>
</a-select>
</div>
</div>
<div class="flex flex-wrap gap-4 mb-6">
<a-tag
:color="filterTags.includes('all') ? 'red' : 'default'"
@click="toggleFilter('all')"
class="cursor-pointer px-3 py-1 text-sm"
>
All
</a-tag>
<a-tag
:color="filterTags.includes('today') ? 'red' : 'default'"
@click="toggleFilter('today')"
class="cursor-pointer px-3 py-1 text-sm"
>
Today
</a-tag>
<a-tag
:color="filterTags.includes('tomorrow') ? 'red' : 'default'"
@click="toggleFilter('tomorrow')"
class="cursor-pointer px-3 py-1 text-sm"
>
Tomorrow
</a-tag>
<a-tag
:color="filterTags.includes('weekend') ? 'red' : 'default'"
@click="toggleFilter('weekend')"
class="cursor-pointer px-3 py-1 text-sm"
>
Weekend
</a-tag>
<a-tag
:color="filterTags.includes('verified') ? 'red' : 'default'"
@click="toggleFilter('verified')"
class="cursor-pointer px-3 py-1 text-sm"
>
Verified Drivers
</a-tag>
</div>
<!-- Ride Cards -->
<div class="space-y-4">
<div v-for="(ride, index) in availableRides" :key="index" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
<div class="flex flex-col md:flex-row gap-4">
<div class="md:w-1/4">
<div class="relative">
<img
:src="ride.driverImage"
:alt="ride.driverName"
class="w-full h-32 object-cover rounded-lg"
/>
<div class="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
<div class="flex items-center px-2">
<star-filled class="text-yellow-400 mr-1" />
<span class="font-medium">{{ ride.rating }}</span>
</div>
</div>
</div>
<div class="mt-2 text-center">
<p class="font-medium">{{ ride.driverName }}</p>
<div class="flex items-center justify-center">
<safety-certificate-outlined v-if="ride.verified" class="text-green-500 mr-1" />
<span class="text-sm text-gray-600">{{ ride.verified ? 'Verified Driver' : 'Driver' }}</span>
</div>
</div>
</div>
<div class="md:w-2/4">
<div class="flex items-start mb-3">
<div class="mr-3 mt-1">
<div class="w-2 h-2 rounded-full bg-green-500"></div>
<div class="w-0.5 h-12 bg-gray-300 mx-auto my-1"></div>
<div class="w-2 h-2 rounded-full bg-red-500"></div>
</div>
<div>
<p class="font-medium">{{ ride.origin }}</p>
<p class="text-sm text-gray-500 mb-6">{{ formatTime(ride.departureTime) }}</p>
<p class="font-medium">{{ ride.destination }}</p>
<p class="text-sm text-gray-500">Est. arrival: {{ formatTime(ride.arrivalTime) }}</p>
</div>
</div>
<div class="flex flex-wrap gap-2">
<div class="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
<car-outlined class="mr-1" />
{{ ride.vehicle }}
</div>
<div class="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
<team-outlined class="mr-1" />
{{ ride.availableSeats }} seats
</div>
<div class="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
<clock-circle-outlined class="mr-1" />
{{ ride.duration }}
</div>
</div>
</div>
<div class="md:w-1/4 flex flex-col justify-between">
<div>
<p class="text-2xl font-bold text-red-600">${{ ride.price }}</p>
<p class="text-sm text-gray-500">per person</p>
</div>
<button
class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium mt-4 transition-all whitespace-nowrap !rounded-button cursor-pointer"
@click="() => { selectedRide = ride; showBookingModal = true; }"
>
Book Seat
</button>
<!-- Booking Modal -->
<a-modal
v-model:visible="showBookingModal"
title="Book Your Ride"
width="600px"
@ok="handleBookingConfirmation"
@cancel="handleBookingCancel"
:footer="null"
>
<div v-if="selectedRide" class="space-y-6">
<!-- Ride Details -->
<div class="bg-gray-50 p-4 rounded-lg">
<div class="flex items-start mb-4">
<img :src="selectedRide.driverImage" :alt="selectedRide.driverName" class="w-16 h-16 rounded-full mr-4 object-cover" />
<div>
<h4 class="font-bold text-lg">{{ selectedRide.driverName }}</h4>
<div class="flex items-center">
<star-filled class="text-yellow-400 mr-1" />
<span>{{ selectedRide.rating }}</span>
<safety-certificate-outlined v-if="selectedRide.verified" class="text-green-500 ml-2 mr-1" />
<span v-if="selectedRide.verified" class="text-green-500">Verified</span>
</div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between">
<span class="text-gray-600">From:</span>
<span class="font-medium">{{ selectedRide.origin }}</span>
</div>
<div class="flex justify-between">
<span class="text-gray-600">To:</span>
<span class="font-medium">{{ selectedRide.destination }}</span>
</div>
<div class="flex justify-between">
<span class="text-gray-600">Departure:</span>
<span class="font-medium">{{ selectedRide.departureTime }}</span>
</div>
<div class="flex justify-between">
<span class="text-gray-600">Arrival:</span>
<span class="font-medium">{{ selectedRide.arrivalTime }}</span>
</div>
<div class="flex justify-between">
<span class="text-gray-600">Vehicle:</span>
<span class="font-medium">{{ selectedRide.vehicle }}</span>
</div>
</div>
</div>
<!-- Booking Form -->
<div class="space-y-4">
<div>
<label class="block text-gray-700 mb-2">Number of Seats</label>
<a-input-number
v-model:value="bookingForm.seats"
:min="1"
:max="selectedRide.availableSeats"
class="w-full"
/>
</div>
<div>
<label class="block text-gray-700 mb-2">Contact Number</label>
<a-input
v-model:value="bookingForm.contactNumber"
placeholder="Enter your contact number"
/>
</div>
<div>
<label class="block text-gray-700 mb-2">Special Requests</label>
<a-textarea
v-model:value="bookingForm.specialRequests"
placeholder="Any special requirements or requests?"
:rows="3"
/>
</div>
<div>
<label class="block text-gray-700 mb-2">Payment Method</label>
<a-radio-group v-model:value="bookingForm.paymentMethod" class="w-full">
<div class="grid grid-cols-2 gap-4">
<a-radio value="card" class="w-full p-4 border rounded-lg">
<div class="flex items-center">
<credit-card-outlined class="text-xl mr-2" />
<span>Credit Card</span>
</div>
</a-radio>
<a-radio value="paypal" class="w-full p-4 border rounded-lg">
<div class="flex items-center">
<dollar-outlined class="text-xl mr-2" />
<span>PayPal</span>
</div>
</a-radio>
</div>
</a-radio-group>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<div class="flex justify-between mb-2">
<span class="text-gray-600">Price per seat:</span>
<span class="font-medium">${{ selectedRide.price }}</span>
</div>
<div class="flex justify-between mb-2">
<span class="text-gray-600">Number of seats:</span>
<span class="font-medium">{{ bookingForm.seats }}</span>
</div>
<div class="flex justify-between font-bold text-lg">
<span>Total:</span>
<span>${{ selectedRide.price * bookingForm.seats }}</span>
</div>
</div>
<button
class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-all whitespace-nowrap !rounded-button"
@click="handleBookingConfirmation"
>
Confirm Booking
</button>
</div>
</div>
</a-modal>
</div>
</div>
</div>
<div v-if="availableRides.length === 0" class="text-center py-8">
<inbox-outlined style="font-size: 48px" class="text-gray-300 mb-4" />
<p class="text-gray-500">No rides available for your search criteria.</p>
<p class="text-gray-500">Try adjusting your filters or search for a different date.</p>
</div>
</div>
<div class="mt-6 flex justify-center">
<a-pagination v-model:current="currentPage" :total="50" show-less-items />
</div>
</div>
<!-- Map Section -->
<div class="bg-white rounded-xl shadow-lg p-6 mb-6">
<h3 class="text-xl font-bold mb-4">Popular Routes</h3>
<div class="h-80 bg-gray-100 rounded-lg overflow-hidden relative">
<img
src="https://public.readdy.ai/ai/img_res/217a6fedee8e044199b82715d1e0b0fe.jpg"
alt="Map showing popular routes"
class="w-full h-full object-cover"
/>
<div class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
<div class="flex items-center space-x-3">
<button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
<plus-outlined />
</button>
<button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
<minus-outlined />
</button>
<button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
<aim-outlined />
</button>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Incentives & Loyalty Programs Section -->
<div class="bg-white rounded-xl shadow-lg p-8 mt-12">
<h2 class="text-2xl font-bold mb-6 text-center">Incentives & Loyalty Programs</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div class="flex flex-col items-center text-center p-6 bg-red-50 rounded-xl">
<div class="bg-red-100 p-4 rounded-full mb-4">
<star-filled style="font-size: 32px" class="text-red-600" />
</div>
<h3 class="text-xl font-bold mb-2">Reward Points</h3>
<p class="text-gray-600 mb-4">Earn points with every ride! Get 100 points for each completed trip and redeem them for exclusive rewards.</p>
<div class="w-full bg-white rounded-lg p-4 shadow-sm">
<div class="flex justify-between items-center mb-2">
<span class="font-medium">Bronze Level</span>
<span class="text-red-600">0-1000 points</span>
</div>
<div class="flex justify-between items-center mb-2">
<span class="font-medium">Silver Level</span>
<span class="text-red-600">1001-5000 points</span>
</div>
<div class="flex justify-between items-center">
<span class="font-medium">Gold Level</span>
<span class="text-red-600">5000+ points</span>
</div>
</div>
</div>
<div class="flex flex-col items-center text-center p-6 bg-red-50 rounded-xl">
<div class="bg-red-100 p-4 rounded-full mb-4">
<trophy-outlined style="font-size: 32px" class="text-red-600" />
</div>
<h3 class="text-xl font-bold mb-2">Monthly Milestones</h3>
<p class="text-gray-600 mb-4">Complete more rides to unlock bigger discounts! Track your progress and earn rewards.</p>
<div class="w-full bg-white rounded-lg p-4 shadow-sm">
<div class="flex justify-between items-center mb-2">
<span class="font-medium">5 Rides</span>
<span class="text-red-600">5% off</span>
</div>
<div class="flex justify-between items-center mb-2">
<span class="font-medium">10 Rides</span>
<span class="text-red-600">10% off</span>
</div>
<div class="flex justify-between items-center">
<span class="font-medium">20+ Rides</span>
<span class="text-red-600">15% off</span>
</div>
</div>
</div>
</div>
</div>
<!-- Trust & Safety Section -->
<div class="bg-white rounded-xl shadow-lg p-8 mt-12">
<h2 class="text-2xl font-bold mb-6 text-center">Trust & Safety</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<div class="flex flex-col items-center text-center">
<div class="bg-red-100 p-4 rounded-full mb-4">
<safety-outlined style="font-size: 32px" class="text-red-600" />
</div>
<h3 class="text-xl font-bold mb-2">Verified Profiles</h3>
<p class="text-gray-600">All drivers undergo thorough verification process including ID checks and vehicle inspections.</p>
</div>
<div class="flex flex-col items-center text-center">
<div class="bg-red-100 p-4 rounded-full mb-4">
<lock-outlined style="font-size: 32px" class="text-red-600" />
</div>
<h3 class="text-xl font-bold mb-2">Secure Payments</h3>
<p class="text-gray-600">Your payment information is encrypted and securely processed. Pay online or in cash.</p>
</div>
<div class="flex flex-col items-center text-center">
<div class="bg-red-100 p-4 rounded-full mb-4">
<message-outlined style="font-size: 32px" class="text-red-600" />
</div>
<h3 class="text-xl font-bold mb-2">24/7 Support</h3>
<p class="text-gray-600">Our customer support team is available around the clock to assist with any issues.</p>
</div>
</div>
<div class="flex justify-center mt-8">
<div class="flex items-center space-x-6">
<img src="https://public.readdy.ai/ai/img_res/974ac5a0b3097b57e56e3ac68348c99a.jpg" alt="Security Badge" class="h-12" />
<img src="https://public.readdy.ai/ai/img_res/3552625098636f73ba12da80a34c1b31.jpg" alt="Driver Verification Badge" class="h-12" />
<img src="https://public.readdy.ai/ai/img_res/5a28c4f238d362390d9aa0ca3d4b655a.jpg" alt="Secure Payment Badge" class="h-12" />
</div>
</div>
</div>
<!-- Testimonials Section -->
<div class="mt-12 mb-12">
<h2 class="text-2xl font-bold mb-8 text-center">What Our Users Say</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="bg-white rounded-xl shadow-lg p-6">
<div class="flex items-start mb-4">
<img
src="https://public.readdy.ai/ai/img_res/377eba23bd3a905b334f078860907ab8.jpg"
alt="Sarah Johnson"
class="w-12 h-12 rounded-full mr-4 object-cover"
/>
<div>
<h4 class="font-bold">Sarah Johnson</h4>
<div class="flex text-yellow-400">
<star-filled />
<star-filled />
<star-filled />
<star-filled />
<star-filled />
</div>
</div>
</div>
<p class="text-gray-600">"I've been using RideShare for my daily commute for the past 6 months. It's saved me so much money and I've met some amazing people along the way!"</p>
</div>
<div class="bg-white rounded-xl shadow-lg p-6">
<div class="flex items-start mb-4">
<img
src="https://public.readdy.ai/ai/img_res/34a42dfad8748c127c5d7aaa9b5f865a.jpg"
alt="Michael Chen"
class="w-12 h-12 rounded-full mr-4 object-cover"
/>
<div>
<h4 class="font-bold">Michael Chen</h4>
<div class="flex text-yellow-400">
<star-filled />
<star-filled />
<star-filled />
<star-filled />
<star-outlined />
</div>
</div>
</div>
<p class="text-gray-600">"As a driver, I can offset my travel costs while helping others get where they need to go. The platform is easy to use and the support team is always helpful."</p>
</div>
<div class="bg-white rounded-xl shadow-lg p-6">
<div class="flex items-start mb-4">
<img
src="https://public.readdy.ai/ai/img_res/3d2c7e0f8ff98084f96fe50fcdeb4518.jpg"
alt="Jessica Martinez"
class="w-12 h-12 rounded-full mr-4 object-cover"
/>
<div>
<h4 class="font-bold">Jessica Martinez</h4>
<div class="flex text-yellow-400">
<star-filled />
<star-filled />
<star-filled />
<star-filled />
<star-half-filled />
</div>
</div>
</div>
<p class="text-gray-600">"I was skeptical at first, but after my first ride I was convinced. The verification process makes me feel safe, and the prices are much better than traditional taxis."</p>
</div>
</div>
</div>
<!-- Download App Section -->
<div class="bg-red-600 rounded-xl shadow-lg p-8 mt-12 mb-12">
<div class="flex flex-col md:flex-row items-center">
<div class="md:w-2/3 text-white mb-6 md:mb-0">
<h2 class="text-3xl font-bold mb-4">Download Our Mobile App</h2>
<p class="text-xl mb-6">Get the full RideShare experience on your mobile device. Book rides, track your journey, and stay connected on the go.</p>
<div class="flex space-x-4">
<button class="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium flex items-center transition-all whitespace-nowrap !rounded-button cursor-pointer">
<apple-outlined class="mr-2 text-xl" />
App Store
</button>
<button class="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium flex items-center transition-all whitespace-nowrap !rounded-button cursor-pointer">
<android-outlined class="mr-2 text-xl" />
Google Play
</button>
</div>
</div>
<div class="md:w-1/3">
<img
src="https://public.readdy.ai/ai/img_res/a3aed002bfe2d55824fb85600c964072.jpg"
alt="RideShare Mobile App"
class="max-h-80 mx-auto"
/>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="bg-gray-800 text-white py-12">
<div class="container mx-auto px-4">
<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
<div>
<h3 class="text-xl font-bold mb-4">Campus Ride</h3>
<p class="text-gray-400 mb-4">Connecting drivers and passengers for a more sustainable future.</p>
<div class="flex space-x-4">
<a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">
<facebook-outlined />
</a>
<a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">
<twitter-outlined />
</a>
<a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">
<instagram-outlined />
</a>
<a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">
<linkedin-outlined />
</a>
</div>
</div>
<div>
<h4 class="font-bold mb-4">Company</h4>
<ul class="space-y-2">
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">How It Works</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Careers</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Press</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Blog</a></li>
</ul>
</div>
<div>
<h4 class="font-bold mb-4">Support</h4>
<ul class="space-y-2">
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Help Center</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Safety</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact Us</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">COVID-19</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Report an Issue</a></li>
</ul>
</div>
<div>
<h4 class="font-bold mb-4">Legal</h4>
<ul class="space-y-2">
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Terms of Service</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Cookie Policy</a></li>
<li><a href="#" class="text-gray-400 hover:text-white transition-colors cursor-pointer">Accessibility</a></li>
</ul>
</div>
</div>
<div class="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
<p class="text-gray-400 mb-4 md:mb-0">© 2025 RideShare. All rights reserved.</p>
<div class="flex items-center space-x-4">
<div class="flex items-center text-gray-400">
<credit-card-outlined class="mr-2" />
<span>Visa</span>
</div>
<div class="flex items-center text-gray-400">
<credit-card-outlined class="mr-2" />
<span>Mastercard</span>
</div>
<div class="flex items-center text-gray-400">
<dollar-outlined class="mr-2" />
<span>PayPal</span>
</div>
<div class="flex items-center text-gray-400">
<apple-outlined class="mr-2" />
<span>Apple Pay</span>
</div>
</div>
</div>
</div>
</footer>
</div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { notification } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import type { UploadProps } from 'ant-design-vue';
import {
EnvironmentOutlined,
AimOutlined,
CarOutlined,
TeamOutlined,
ClockCircleOutlined,
BankOutlined,
BookOutlined,
CalendarOutlined,
ShoppingOutlined,
StarFilled,
StarOutlined,
StarHalfFilled,
SafetyCertificateOutlined,
LockOutlined,
MessageOutlined,
PlusOutlined,
MinusOutlined,
InboxOutlined,
AppleOutlined,
AndroidOutlined,
FacebookOutlined,
TwitterOutlined,
InstagramOutlined,
LinkedinOutlined,
CreditCardOutlined,
DollarOutlined,
SafetyOutlined,
LeftOutlined,
BellOutlined,
HistoryOutlined,
TrophyOutlined,
WechatOutlined
} from '@ant-design/icons-vue';
// User mode state
const userMode = ref<'passenger' | 'driver'>('passenger');
// Trip categories
const tripCategories = [
{
id: 'airport',
name: 'Airport Trip',
icon: CarOutlined
},
{
id: 'campus',
name: 'Campus Classes',
icon: BookOutlined
},
{
id: 'activities',
name: 'Campus Activities',
icon: CalendarOutlined
},
{
id: 'shopping',
name: 'Shopping Trip',
icon: ShoppingOutlined
}
];
const selectedCategory = ref('airport');
// Passenger form
const passengerForm = ref({
origin: '',
destination: '',
date: null as Dayjs | null,
time: null as Dayjs | null,
passengers: 1,
requirements: '',
paymentMethod: 'online'
});
// Driver form
const driverForm = ref({
origin: '',
destination: '',
date: null as Dayjs | null,
time: null as Dayjs | null,
seats: 3,
price: 25,
vehicle: 'sedan',
notes: ''
});
// File list for upload
const fileList = ref([]);
// Computed values
const estimatedPrice = ref(35);
const estimatedDuration = ref('1h 45min');
// Pagination
const currentPage = ref(1);
// Sorting and filtering
const sortBy = ref('price');
const filterTags = ref(['all']);
// WeChat verification
const showWeChatModal = ref(false);
const weChatForm = ref({
id: '',
code: ''
});
const isCodeSent = ref(false);
const countdown = ref(60);
let timer: NodeJS.Timeout | null = null;
const sendVerificationCode = () => {
isCodeSent.value = true;
countdown.value = 60;
timer = setInterval(() => {
if (countdown.value > 0) {
countdown.value--;
} else {
isCodeSent.value = false;
if (timer) {
clearInterval(timer);
}
}
}, 1000);
};
const handleBookingConfirmation = () => {
if (!bookingForm.value.contactNumber) {
notification.error({
message: 'Contact Number Required',
description: 'Please provide your contact number to proceed with the booking.',
});
return;
}
showBookingModal.value = false;
// Reset form
bookingForm.value = {
seats: 1,
specialRequests: '',
paymentMethod: 'card',
contactNumber: ''
};
// Show success notification
notification.success({
message: 'Booking Confirmed!',
description: 'Your ride has been successfully booked. You will receive a confirmation email shortly with the driver\'s contact details.',
duration: 5,
});
};
const handleBookingCancel = () => {
showBookingModal.value = false;
bookingForm.value = {
seats: 1,
specialRequests: '',
paymentMethod: 'card',
contactNumber: ''
};
};
const handleWeChatVerification = () => {
if (!weChatForm.value.id || !weChatForm.value.code) {
return;
}
// Here you would typically make an API call to verify the WeChat account
// For demo purposes, we'll just show a success message
showWeChatModal.value = false;
weChatForm.value = {
id: '',
code: ''
};
// Show success notification
notification.success({
message: 'WeChat Verified',
description: 'Your WeChat account has been successfully linked.',
placement: 'topRight'
});
};
// Toggle filter function
const toggleFilter = (tag: string) => {
if (tag === 'all') {
filterTags.value = ['all'];
return;
}
// Remove 'all' if it exists
const allIndex = filterTags.value.indexOf('all');
if (allIndex !== -1) {
filterTags.value.splice(allIndex, 1);
}
const index = filterTags.value.indexOf(tag);
if (index === -1) {
filterTags.value.push(tag);
} else {
filterTags.value.splice(index, 1);
// If no filters left, add 'all' back
if (filterTags.value.length === 0) {
filterTags.value = ['all'];
}
}
};
// Disable past dates
const disabledDate = (current: Dayjs) => {
return current && current < dayjs().startOf('day');
};
// Format time function
const formatTime = (time: string) => {
return time;
};
// Search function
const onSearch = (value: string) => {
console.log('search:', value);
};
// Available rides data
// Driver History Modal
const showDriverHistory = ref(false);
// Notifications
const showNotifications = ref(false);
const unreadCount = ref(3);

const notifications = ref([
    {
        id: 1,
        type: 'Ride Confirmation',
        content: 'Your ride to Los Angeles has been confirmed. Driver will arrive at 8:30 AM.',
        timestamp: '5 min ago',
        read: false
    },
    {
        id: 2,
        type: 'Driver Update',
        content: 'Your driver John has arrived at the pickup location.',
        timestamp: '15 min ago',
        read: false
    },
    {
        id: 3,
        type: 'System Alert',
        content: 'Complete your profile to unlock premium features!',
        timestamp: '1 hour ago',
        read: false
    }
]);

const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
};

const markAsRead = (id: number) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification && !notification.read) {
        notification.read = true;
        unreadCount.value--;
    }
};

const markAllAsRead = () => {
    notifications.value.forEach(notification => {
        notification.read = true;
    });
    unreadCount.value = 0;
};

const viewNotificationDetails = (id: number) => {
    // Handle viewing notification details
    console.log('Viewing notification:', id);
    // You can add logic here to show a modal or navigate to a details page
};

// Click outside to close notifications
const closeNotifications = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-panel')) {
        showNotifications.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', closeNotifications);
});

onUnmounted(() => {
    document.removeEventListener('click', closeNotifications);
});

// Recent Activities Data
const recentActivities = ref([
{
route: 'San Francisco, CA → Los Angeles, CA',
date: 'Apr 1, 2025',
rating: 5.0
},
{
route: 'Los Angeles, CA → San Diego, CA',
date: 'Mar 30, 2025',
rating: 4.8
},
{
route: 'San Diego, CA → Las Vegas, NV',
date: 'Mar 28, 2025',
rating: 5.0
},
{
route: 'Las Vegas, NV → San Francisco, CA',
date: 'Mar 25, 2025',
rating: 4.9
}
]);
const showBookingModal = ref(false);
const selectedRide = ref<any>(null);
const bookingForm = ref({
seats: 1,
specialRequests: '',
paymentMethod: 'card',
contactNumber: ''
});
const availableRides = ref([
{
driverName: 'John Smith',
driverImage: 'https://public.readdy.ai/ai/img_res/0b81ac2ae733527fd246b41f1c5e355a.jpg',
rating: 4.8,
verified: true,
origin: 'San Francisco, CA',
destination: 'Los Angeles, CA',
departureTime: '08:30 AM, Apr 2',
arrivalTime: '03:15 PM, Apr 2',
price: 45,
availableSeats: 3,
vehicle: 'Tesla Model 3',
duration: '6h 45min'
},
{
driverName: 'Emily Johnson',
driverImage: 'https://public.readdy.ai/ai/img_res/acec183bef4a70f55d91b559d6bac8a0.jpg',
rating: 4.9,
verified: true,
origin: 'Boston, MA',
destination: 'New York, NY',
departureTime: '10:00 AM, Apr 2',
arrivalTime: '02:30 PM, Apr 2',
price: 35,
availableSeats: 2,
vehicle: 'Honda Civic',
duration: '4h 30min'
},
{
driverName: 'David Wilson',
driverImage: 'https://public.readdy.ai/ai/img_res/6d3c87b63466c768e640f07570f2ea69.jpg',
rating: 4.6,
verified: false,
origin: 'Chicago, IL',
destination: 'Detroit, MI',
departureTime: '09:15 AM, Apr 3',
arrivalTime: '02:45 PM, Apr 3',
price: 40,
availableSeats: 4,
vehicle: 'Toyota Camry',
duration: '5h 30min'
}
]);
</script>
<style scoped>
/* Custom styles */
.ant-upload-drag {
border: 1px dashed #d9d9d9;
border-radius: 0.5rem;
cursor: pointer;
transition: border-color 0.3s;
}
.ant-upload-drag:hover {
border-color: #1890ff;
}
.ant-input-number-handler-wrap {
display: none;
}
/* Override Ant Design styles */
:deep(.ant-select-selector) {
border-radius: 0.375rem !important;
height: 38px !important;
display: flex;
align-items: center;
}
:deep(.ant-picker) {
border-radius: 0.375rem !important;
height: 38px !important;
}
:deep(.ant-input) {
border-radius: 0.375rem !important;
height: 38px !important;
}
:deep(.ant-input-affix-wrapper) {
border-radius: 0.375rem !important;
}
:deep(.ant-tag) {
margin-right: 0;
}
:deep(.ant-pagination-item-active) {
border-color: #dc2626;
}
:deep(.ant-pagination-item-active a) {
color: #dc2626;
}
</style>
