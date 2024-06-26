<template>
    <TransitionRoot as="template" :show=true>
        <Dialog as="div" class="relative z-10" @close="closeModal">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 md:scale-100"
                        leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                        <DialogPanel
                            class="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                            <div
                                class="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg">
                                <button type="button"
                                    class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8 outline-none"
                                    @click="closeModal">
                                    <span class="sr-only">Close</span>
                                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                </button>

                                <div
                                    class="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                                    <!-- Hình ảnh sách -->
                                    <div
                                        class="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                                        <img :src="book.bookPicture" class="object-cover object-center" />
                                    </div>

                                    <!-- Thông tin sách -->
                                    <div class="sm:col-span-8 lg:col-span-7">
                                        <h2 class="text-2xl font-bold text-gray-900 sm:pr-12">{{ book.name }}</h2>

                                        <!-- Phần thông tin sách -->
                                        <section aria-labelledby="information-heading" class="mt-2">
                                            <h3 id="information-heading" class="sr-only">Product information</h3>
                                            <div class="flex justify-between">
                                                <p class="text-xl text-gray-900">{{ book.author.name }}</p>
                                                <p class="text-xl text-gray-900">{{ book.price }} VNĐ/ngày</p>
                                            </div>
                                        </section>

                                        <!-- Phần mô tả sách -->
                                        <section aria-labelledby="options-heading" class="mt-5">
                                            <h3 id="options-heading" class="sr-only">Product description</h3>
                                            <p class="mb-6 text-xl text-gray-900 border-b-2">Description</p>
                                            <p class="text-lg text-gray-500 overflow-hidden hover:text-clip max-h-50">{{
                                                book.description }}</p>
                                        </section>

                                        <!-- Nút "Add to bag" -->
                                        <form @submit.prevent="addToBag">
                                            <button type="submit"
                                                class="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                <i class="fa-solid fa-cart-shopping text-xl me-3"></i>Add to bag
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import {
    Dialog,
    DialogPanel,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { StarIcon } from '@heroicons/vue/20/solid';
import { defineProps, defineEmits, watchEffect } from 'vue';
import store from '@/store';
import tracksService from '@/services/tracks.service';
import { message } from 'antd';
watchEffect(async () => {
    await store.dispatch('fetchUser');
});
const props = defineProps({
    book: Object
});
const addToBag = async () => {
    const track = {
        bookid: props.book,
        readerid:  store.state.user.data._id,// Thay đổi 'reader-id' thành ID của người đọc thực tế
        borroweddate: new Date(), // Ngày mượn hiện tại là null
    };

    try {
        const response = await tracksService.create(track);
        message.success(response.message);
    } catch (error) {
        console.error('Error creating track:', error);
    }
    closeModal()
};
const emits = defineEmits(['close']);

function closeModal() {
    emits('close');
}
</script>
