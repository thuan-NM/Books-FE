<template>
    <Disclosure as="nav" class="bg-gray-800 mb-10" v-slot="{ open }">
        <div class="mx-auto max-w-10xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <!-- Mobile menu button-->
                    <DisclosureButton
                        class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span class="absolute -inset-0.5"></span>
                        <span class="sr-only">Open main menu</span>
                        <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                        <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                    </DisclosureButton>
                </div>
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="flex flex-shrink-0 items-center">
                        <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                            alt="Your Company" />
                    </div>
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            <router-link :to="{ name: 'librarypage' }"
                                class="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Library</router-link>
                        </div>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button type="button"
                        class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span class="absolute -inset-1.5"></span>
                        <span class="sr-only">View notifications</span>
                        <BellIcon class="h-6 w-6" aria-hidden="true" />
                    </button>

                    <!-- Profile dropdown -->
                    <Menu as="div" class="relative ml-3">
                        <div>
                            <MenuButton
                                class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span class="sr-only">Open user menu</span>
                                <span v-if="store.state.user != null" class="block px-4 py-2 text-sm text-white">{{
                                    store.state.user.data.firstName }} {{  store.state.user.data.lastName}}</span>
                            </MenuButton>
                            <MenuButton
                                class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <router-link :to="{ name: 'authpage' }" v-if="store.state.user == null"
                                    class="block px-4 py-2 text-sm text-white">Sign in here</router-link>
                            </MenuButton>
                        </div>
                        <transition enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95">
                            <MenuItems
                                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem v-slot="{ active }">
                                <router-link :to="{ name: 'userpage' }" 
                                    :class="[active ? 'bg-gray-100 text-center' : '', 'block px-4 py-2 text-sm text-gray-700 text-center']">
                                    YourProfile
                                </router-link>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                <DisclosureButton @click="signOut"
                                    :class="[active ? 'bg-gray-100 ' : '', 'block px-4 py-2 text-sm text-gray-700 w-full']">
                                    Sign
                                    out </DisclosureButton>
                                </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>
                </div>
            </div>
        </div>

        <DisclosurePanel class="sm:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2">
                <router-link :to="{ name: 'librarypage' }">
                    <DisclosureButton
                        class="bg-gray-900 text-white block rounded-md px-3 py-2 my-2 text-base font-medium w-full">
                        Library
                    </DisclosureButton>
                </router-link>
            </div>
        </DisclosurePanel>
    </Disclosure>
</template>

<script setup>
import router from '@/router';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { watchEffect } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

watchEffect(async () => {
    await store.dispatch('fetchUser');
});
const signOut = () => {
    store.dispatch('signOut');
    router.push("/auth")
}
</script>