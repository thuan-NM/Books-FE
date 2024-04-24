<template>
    <div class="mt-12">
        <div class="px-4 sm:px-0">
            <h3 class="text-base font-semibold leading-7 text-gray-900">Profile Information</h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal infomation details.</p>
        </div>
        <div class="mt-6 border-t border-gray-300" v-if="store.state.user != null">
            <dl class="divide-y divide-gray-300">
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">First name <i
                            class="fa-solid fa-pencil ml-4"></i>
                    </dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{
                        store.state.user.data.firstName }}
                    </dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">Last name <i
                            class="fa-solid fa-pencil ml-4"></i>
                    </dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{
                        store.state.user.data.lastName }}
                    </dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">Gender<i
                            class="fa-solid fa-pencil ml-4"></i>
                    </dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {{ store.state.user.data.gender }}
                    </dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">Phone number<i
                            class="fa-solid fa-pencil ml-4"></i></dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {{ store.state.user.data.phone }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">Data of Birth <i
                            class="fa-solid fa-pencil ml-4"></i></dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ store.state.user.data.dob }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">Address <i
                            class="fa-solid fa-pencil ml-4"></i>
                    </dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Fugiat ipsum
                        {{ store.state.user.data.address }}</dd>
                </div>
            </dl>
        </div>
    </div>
</template>
<script setup>
import { watchEffect } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

watchEffect(async () => {
    await store.dispatch('fetchUser');
    console.log(store.state.user)
});

</script>