<template>
  <div class="min-h-screen bg-gray-50 main-content pt-16">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-red-600 mb-8">Campus Rideshare</h1>
      
      <!-- User Mode Toggle -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center bg-gray-100 rounded-full p-1 mb-6 max-w-xs">
          <button
            :class="['px-4 py-2 rounded-full text-sm font-medium transition-all flex-1',
            userMode === 'passenger' ? 'bg-red-600 text-white' : 'text-gray-600']"
            @click="userMode = 'passenger'"
          >
            Passenger
          </button>
          <button
            :class="['px-4 py-2 rounded-full text-sm font-medium transition-all flex-1',
            userMode === 'driver' ? 'bg-red-600 text-white' : 'text-gray-600']"
            @click="userMode = 'driver'"
          >
            Driver
          </button>
        </div>

        <h2 class="text-2xl font-bold mb-6">{{ userMode === 'passenger' ? 'Book a Ride' : 'Post a Trip' }}</h2>

        <!-- Passenger Form -->
        <div v-if="userMode === 'passenger'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-2">From</label>
            <input
              v-model="passengerForm.origin"
              placeholder="Enter pickup location"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">To</label>
            <input
              v-model="passengerForm.destination"
              placeholder="Enter destination"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              v-model="passengerForm.date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Time</label>
            <input
              type="time"
              v-model="passengerForm.time"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Passengers</label>
            <input
              type="number"
              v-model="passengerForm.passengers"
              min="1"
              max="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <button class="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md font-medium transition-all mt-6">
              Find Rides
            </button>
          </div>
        </div>

        <!-- Driver Form -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-2">From</label>
            <input
              v-model="driverForm.origin"
              placeholder="Enter starting point"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">To</label>
            <input
              v-model="driverForm.destination"
              placeholder="Enter destination"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              v-model="driverForm.date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Time</label>
            <input
              type="time"
              v-model="driverForm.time"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Available Seats</label>
            <input
              type="number"
              v-model="driverForm.seats"
              min="1"
              max="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Price per Seat ($)</label>
            <input
              type="number"
              v-model="driverForm.price"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Vehicle Type</label>
            <select
              v-model="driverForm.vehicle"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Select vehicle</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          <div>
            <button class="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md font-medium transition-all mt-6">
              Post Trip
            </button>
          </div>
        </div>
      </div>

      <!-- Available Rides Section -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Available Rides</h2>
        
        <!-- Filter Tags -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="tag in filterOptions"
            :key="tag"
            :class="['px-3 py-1 text-sm rounded-full border transition-all',
            activeFilter === tag ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:border-red-600']"
            @click="activeFilter = tag"
          >
            {{ tag }}
          </button>
        </div>

        <!-- Ride Cards -->
        <div class="space-y-4">
          <div
            v-for="(ride, index) in availableRides"
            :key="index"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col md:flex-row gap-4">
              <div class="md:w-1/4">
                <img
                  :src="ride.driverImage"
                  :alt="ride.driverName"
                  class="w-full h-32 object-cover rounded-lg"
                />
                <div class="mt-2 text-center">
                  <p class="font-medium">{{ ride.driverName }}</p>
                  <div class="flex items-center justify-center mt-1">
                    <span class="text-yellow-400 mr-1">‚≠ê</span>
                    <span class="font-medium">{{ ride.rating }}</span>
                    <span v-if="ride.verified" class="text-green-500 ml-2">‚úì Verified</span>
                  </div>
                </div>
              </div>
              
              <div class="md:w-2/4">
                <div class="space-y-2">
                  <div>
                    <p class="font-medium">{{ ride.origin }}</p>
                    <p class="text-sm text-gray-500">{{ ride.departureTime }}</p>
                  </div>
                  <div class="border-l-2 border-gray-300 h-8 ml-2"></div>
                  <div>
                    <p class="font-medium">{{ ride.destination }}</p>
                    <p class="text-sm text-gray-500">Est. arrival: {{ ride.arrivalTime }}</p>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2 mt-4">
                  <span class="bg-gray-100 rounded-full px-3 py-1 text-sm">
                    Ì∫ó {{ ride.vehicle }}
                  </span>
                  <span class="bg-gray-100 rounded-full px-3 py-1 text-sm">
                    Ì±• {{ ride.availableSeats }} seats
                  </span>
                  <span class="bg-gray-100 rounded-full px-3 py-1 text-sm">
                    ‚è±Ô∏è {{ ride.duration }}
                  </span>
                </div>
              </div>
              
              <div class="md:w-1/4 flex flex-col justify-between">
                <div>
                  <p class="text-2xl font-bold text-red-600">${{ ride.price }}</p>
                  <p class="text-sm text-gray-500">per person</p>
                </div>
                <button
                  class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium mt-4 transition-all"
                  @click="openBookingModal(ride)"
                >
                  Book Seat
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="availableRides.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-lg">No rides available</p>
          <p class="text-gray-400">Try adjusting your search criteria</p>
        </div>
      </div>

      <!-- Booking Modal -->
      <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeBookingModal">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
          <h3 class="text-xl font-bold mb-4">Book Your Ride</h3>
          <div v-if="selectedRide" class="space-y-4">
            <div class="flex items-center mb-4">
              <img :src="selectedRide.driverImage" class="w-12 h-12 rounded-full mr-3" />
              <div>
                <p class="font-medium">{{ selectedRide.driverName }}</p>
                <p class="text-sm text-gray-600">{{ selectedRide.origin }} ‚Üí {{ selectedRide.destination }}</p>
              </div>
            </div>
            
            <div>
              <label class="block text-gray-700 mb-2">Number of Seats</label>
              <input
                type="number"
                v-model="bookingForm.seats"
                :min="1"
                :max="selectedRide.availableSeats"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            
            <div>
              <label class="block text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                v-model="bookingForm.contactNumber"
                placeholder="Enter your contact number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              />
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
            
            <div class="flex space-x-3">
              <button
                class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-all"
                @click="closeBookingModal"
              >
                Cancel
              </button>
              <button
                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all"
                @click="confirmBooking"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// User mode state
const userMode = ref('passenger')
const activeFilter = ref('All')

// Form data
const passengerForm = ref({
  origin: '',
  destination: '',
  date: '',
  time: '',
  passengers: 1
})

const driverForm = ref({
  origin: '',
  destination: '',
  date: '',
  time: '',
  seats: 3,
  price: 25,
  vehicle: ''
})

// Filter options
const filterOptions = ['All', 'Today', 'Tomorrow', 'Weekend', 'Verified Drivers']

// Booking modal
const showBookingModal = ref(false)
const selectedRide = ref(null)
const bookingForm = ref({
  seats: 1,
  contactNumber: ''
})

// Sample data
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
])

// Functions
const openBookingModal = (ride) => {
  selectedRide.value = ride
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedRide.value = null
  bookingForm.value = {
    seats: 1,
    contactNumber: ''
  }
}

const confirmBooking = () => {
  if (!bookingForm.value.contactNumber) {
    alert('Please provide your contact number')
    return
  }
  alert('Booking confirmed! You will receive a confirmation email shortly.')
  closeBookingModal()
}
</script>

<style scoped>
.main-content {
  flex: 1;
}
</style>
