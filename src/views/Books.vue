<script setup>
import { ref, watchEffect } from 'vue';
import BooksOverview from './BooksOverview.vue';
import booksService from '@/services/books.service';

const props = defineProps({
  filters: Object,
});

const products = ref([]);
const selectedBook = ref(null);
const isModalOpen = ref(false);

watchEffect(async () => {
  // Check if filters is not null before making the API call
  if (props.filters) {
    const allProducts = await booksService.getFiltered(props.filters);
    products.value = allProducts.data.map(product => ({
      id: product._id,
      name: product.name,
      bookPicture: product.bookPicture,
      pubyear: product.pubyear,
      quantity: product.quantity,
      price: product.price,
      author: product.author,
      description: product.description,
    }));
  }
});

function openModal(book) {
  selectedBook.value = book;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-10xl px-4 py-16 sm:px-6 sm:py-6 lg:max-w-10xl lg:px-8">
      <div class="mt-6 grid grid-cols-1 pl-auto gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-0">
        <div v-for="product in products" :key="product.id" @click="openModal(product)"
          class="group relative h-5/6 w-5/6 mx-auto">
          <div
            class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-full">
            <img :src="product.bookPicture" class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
          </div>
          <div class="mt-4 flex justify-between">
            <div>
              <h3 class="text-sm text-gray-500">
                <a :href="product.href">
                  <span aria-hidden="true" class="absolute inset-0 truncate"></span>
                  {{ product.name }}
                </a>
              </h3>
              <p class="mt-1 text-sm text-gray-700">{{ product.author.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BooksOverview v-if="isModalOpen" :book="selectedBook" @close="isModalOpen = false" />
  </div>
</template>
