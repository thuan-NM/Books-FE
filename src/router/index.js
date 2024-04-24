import { createWebHistory, createRouter } from "vue-router";
import LibraryPage from "@/pages/LibraryPage.vue";
import UserPage from "@/pages/UserPage.vue";
import AuthPage from "@/pages/AuthPage.vue";
const routes = [
    {
        path: "/",
        name: "librarypage",
        component: LibraryPage,
    },
    {
        path: "/userpage",
        name: "userpage",
        component: UserPage,
    },
    {
        path: "/auth",
        name: "authpage",
        component: AuthPage,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/pages/404Page.vue"),
    },    
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
export default router;