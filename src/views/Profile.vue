<template>
    <div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-baseline justify-between border-b-2 border-gray-200 py-6">
            <h3 class="text-2xl font-bold tracking-tight text-gray-900">User Management</h3>
            <div class="flex items-center">
                <button type="button" class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                    @click="mobileFiltersOpen = true">
                    <span class="sr-only">Filters</span>
                    <FunnelIcon class="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 my-12">
            <form class="hidden lg:block py-16 sm:py-6 pt-12 pr-6 border-r-2">
                <ul role="list" class="space-y-4 border-b border-gray-200 py-6 text-sm font-medium text-gray-900">
                    <li :class="{ 'bg-gray-900': showUserInfo, 'bg-gray-400': !showUserInfo }"
                        class="p-3 rounded-md ring-1 ring-gray-400" @click.prevent="showUserInfo = true">
                        <button class="text-white">My Profile</button>
                    </li>
                    <li :class="{ 'bg-gray-900': !showUserInfo, 'bg-gray-400': showUserInfo }"
                        class="p-3 rounded-md ring-1 ring-gray-400" @click.prevent="showUserInfo = false">
                        <button class="text-white">Manager Books</button>
                    </li>
                </ul>


                <Disclosure as="div" v-for="section in filters" :key="section.id" class="border-b border-gray-200 py-6"
                    v-slot="{ open }">
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
                        <div class="space-y-4">
                            <div v-for="(option, optionIdx) in section.options" :key="option.value"
                                class="flex items-center">
                                <input :id="`filter-${section.id}-${optionIdx}`" :name="`${section.id}[]`"
                                    :value="option.value" type="checkbox" :checked="option.checked"
                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label :for="`filter-${section.id}-${optionIdx}`" class="ml-3 text-sm text-gray-600">{{
                                    option.label }}</label>
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </form>
            <!-- <div class="lg:col-span-3">
                <UserInfo />
            </div> -->
            <div class="lg:col-span-3">
                <RentedBooks v-if="!showUserInfo" />
                <UserInfo v-else />
            </div>
        </div>
    </div>
</template>
<script setup>
import UserInfo from '@/components/UserInfo.vue';
import RentedBooks from '../components/RentedBooks.vue';
import { ref } from 'vue';

const showUserInfo = ref(true);
</script>