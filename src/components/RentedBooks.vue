<template>
  <div class="mt-12">
    <div class="px-4 sm:px-0">
      <h3 class="text-base font-semibold leading-7 text-gray-900">Renting Information</h3>
      <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Renting infomation details.</p>
    </div>
    <div class="mt-6 border-t border-gray-300">
      <ul role="list" class="divide-y divide-gray-300">
        <li v-for="track in tracks" :key="track._id" class="flex justify-between gap-x-6 py-5">
          <div class="flex min-w-0 gap-x-4">
            <img class="h-full w-full max-w-20 flex-none bg-gray-50" :src="track.book.bookPicture" alt="" />
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-400">{{ track.book.name }}</p>
            </div>
          </div>
          <div class="shrink-0 sm:flex sm:flex-col sm:items-end">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ track.book.price }} VND/Ngày</p>
            <p v-if="track.borroweddate" class="mt-1 text-xs leading-5 text-gray-500">
              Rent at: <time :datetime="track.borroweddate">{{ track.borroweddate }}</time>
            </p>
            <p v-if="track.borroweddate" class="mt-1 text-xs leading-5 text-gray-500">
              Total: {{ totalPay(track) }} VND
            </p>
            <button type="button" class="mt-3 p-1 rounded-md ring-1 ring-gray-400"
              @click="openModal(track)">Return</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Return Book
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to return the book "{{ selectedTrack.book.name }}"? The total payment is {{
                    totalPay(selectedTrack) }} VND.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="confirmReturn">
            Confirm
          </button>
          <button type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            @click="closeModal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import tracksService from '@/services/tracks.service';
import { ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
const tracks = ref([]);
const store = useStore();
const now = ref(new Date());
const showModal = ref(false);
const selectedTrack = ref(null);

watchEffect(async () => {
  await store.dispatch('fetchUser');
  if (store.state.user.data && store.state.user.data._id) {
    const allTracks = await tracksService.getFiltered({ userId: store.state.user.data._id });
    tracks.value = allTracks.data.map(track => {
      const date = new Date(track.borroweddate);
      const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
      return {
        id: track._id,
        readerid: track.readerid,
        book: track.book,
        borroweddate: formattedDate,
      }
    });
  }
});

const totalPay = (track) => {
  const borrowedDate = new Date(track.borroweddate);
  if (isNaN(borrowedDate)) {
    return 'Invalid date';
  }
  const diffTime = Math.abs(now.value.getTime() - borrowedDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * track.book.price;
};

const openModal = (track) => {
  selectedTrack.value = track;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const confirmReturn = async () => {
  await returnBook(selectedTrack.value);
  closeModal();
};

const returnBook = async (track) => {
  try {
    await tracksService.delete(track.id);
    tracks.value = tracks.value.filter(t => t.id !== track.id);
  } catch (error) {
    console.error('Failed to return the book:', error);
  }
};
</script>
