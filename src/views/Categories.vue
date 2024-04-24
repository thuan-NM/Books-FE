<script setup>
import { ref, onMounted, watchEffect, defineEmits, watch, nextTick } from 'vue';
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/vue/20/solid'

import AuthorService from "@/services/publisher.service"
const allAuthor = ref([]); // Tạo một biến phản ứng để lưu trữ allAuthor
const filters = ref([]);
const selectedFilters = ref({});// Tạo filters như một biến phản ứng
const searchQuery = ref('');

const emit = defineEmits(['filters-updated', 'search-updated']);
onMounted(async () => {
    const authors = await AuthorService.getAll(); // Gán giá trị cho allAuthor khi dữ liệu sẵn sàng
    allAuthor.value = authors.data.map(author => ({
        value: author.name,
        label: author.name,
    }));

    // Cập nhật filters sau khi allAuthor đã sẵn sàng
    filters.value = [
        // ...
        {
            id: 'price',
            name: 'Price',
            options: [
                { value: { min: 10000, max: 20000 }, label: '10,000 to 20,000', checked: false },
                { value: { min: 20000, max: 30000 }, label: '20,000 to 30,000', checked: false },
                { value: { min: 30000, max: 50000 }, label: '30,000 to 50,000', checked: false },
                { value: { min: 50000, max: 100000 }, label: '50,000 to 100,000', checked: false },
                { value: { min: 100000, max: 99999999999999 }, label: 'Greater than 100,000', checked: false },
            ],
        },
        {
            id: 'author',
            name: 'Author',
            options: allAuthor.value, // Tùy chọn sẽ được tải từ API
        },
        // ...
    ];
    filters.value.forEach(filter => {
        filter.options.forEach(option => {
            option.checked = selectedFilters[filter.id] === option.value;
        });
    });
});
watch(filters, () => {
    selectedFilters.value = filters.value.reduce((acc, filter) => {
        const selectedOptions = filter.options.filter(option => option.checked);
        if (selectedOptions.length > 0) {
            // If the filter is 'price', we want to get the minimum and maximum values
            if (filter.id === 'price') {
                const minPrices = selectedOptions.map(option => option.value.min);
                const maxPrices = selectedOptions.map(option => option.value.max);
                acc[filter.id] = { min: Math.min(...minPrices), max: Math.max(...maxPrices) };
            } else {
                acc[filter.id] = selectedOptions.map(option => option.value);
            }
        }
        return acc;
    }, {});

    // Emit an event with the selected filters
    emit('filters-updated', selectedFilters.value);
    console.log(selectedFilters.value)
}, { deep: true }); // Use deep watcher to detect changes in nested properties

const mobileFiltersOpen = ref(false)
</script>

<template>
    <TransitionRoot as="template" :show="mobileFiltersOpen">
        <Dialog as="div" class="relative z-40 lg:hidden" @close="mobileFiltersOpen = false">
            <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
                leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 z-40 flex">
                <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                    enter-from="translate-x-full" enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                    leave-to="translate-x-full">
                    <DialogPanel
                        class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                        <div class="flex items-center justify-between px-4">
                            <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                            <button type="button"
                                class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                @click="mobileFiltersOpen = false">
                                <span class="sr-only">Close menu</span>
                                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>

                        <!-- Filters -->
                        <form class="mt-4 border-t border-gray-200">
                            <Disclosure as="div" v-for="section in filters" :key="section.id"
                                class="border-t border-gray-200 px-4 py-6" v-slot="{ open }">
                                <h3 class="-mx-2 -my-3 flow-root">
                                    <DisclosureButton
                                        class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                        <span class="font-medium text-gray-900">{{ section.name }}</span>
                                        <span class="ml-6 flex items-center">
                                            <PlusIcon v-if="!open" class="h-5 w-5" aria-hidden="true" />
                                            <MinusIcon v-else class="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </DisclosureButton>
                                </h3>
                                <DisclosurePanel class="pt-6">
                                    <div class="space-y-6">
                                        <div v-for="(option, optionIdx) in section.options" :key="option.value"
                                            class="flex items-center">
                                            <input :id="`filter-mobile-${section.id}-${optionIdx}`"
                                                :name="`${section.id}[]`" :value="option.value" type="checkbox"
                                                :checked="option.checked"
                                                @change="option.checked = $event.target.checked; emit('filters-updated', selectedFilters);"
                                                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            <label :for="`filter-mobile-${section.id}-${optionIdx}`"
                                                class="ml-3 min-w-0 flex-1 text-gray-500">{{ option.label }}</label>
                                        </div>
                                    </div>
                                </DisclosurePanel>
                            </Disclosure>
                        </form>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
    <main class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-baseline justify-between border-b border-gray-500 pb-6 pt-4">
            <div class="border-2 w-5/6 flex mx-auto rounded-lg border-gray-500">
                <input type="text" class="w-11/12 p-3 focus:outline-none rounded-lg" placeholder="Tìm tên sách ... "
                    v-model="searchQuery">
                <button class="bg-gray-900 w-1/12 h-100 hover:bg-gray-700 " @click="handleSearch"><i
                        class="fas fa-search text-white text-xl"></i></button>
            </div>
        </div>

        <section aria-labelledby="products-heading" class="pb-24 pt-6">
            <div class="flex items-baseline justify-between border-b-2 border-gray-200 py-6">
                <h3 class="text-2xl font-bold tracking-tight text-gray-900">Categories</h3>
                <div class="flex items-center">
                    <button type="button" class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                        @click="mobileFiltersOpen = true">
                        <span class="sr-only">Filters</span>
                        <FunnelIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                <form class="hidden lg:block py-16 sm:py-6 mt-6">
                    <Disclosure as="div" v-for="section in filters" :key="section.id"
                        class="border-b border-gray-200 py-6" v-slot="{ open }">
                        <h3 class="-my-3 flow-root">
                            <DisclosureButton
                                class="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                <span class="font-medium text-gray-900">{{ section.name }}</span>
                                <span class="ml-6 flex items-center">
                                    <PlusIcon v-if="!open" class="h-5 w-5" aria-hidden="true" />
                                    <MinusIcon v-else class="h-5 w-5" aria-hidden="true" />
                                </span>
                            </DisclosureButton>
                        </h3>
                        <DisclosurePanel class="pt-6">
                            <div class="space-y-6">
                                <div v-for="(option, optionIdx) in section.options" :key="option.value"
                                    class="flex items-center">
                                    <input :id="`filter-mobile-${section.id}-${optionIdx}`" :name="`${section.id}[]`"
                                        :value="option.value" type="checkbox" :checked="option.checked"
                                        @change="option.checked = $event.target.checked; emit('filters-updated', selectedFilters.value);"
                                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <label :for="`filter-mobile-${section.id}-${optionIdx}`"
                                        class="ml-3 min-w-0 flex-1 text-gray-500">{{ option.label }}</label>
                                </div>
                            </div>
                        </DisclosurePanel>
                    </Disclosure>
                </form>
                <div class="lg:col-span-4">
                    <Books :filters="selectedFilters" :searchQuery="searchQuery" />
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import Books from '@/views/Books.vue';
</script>