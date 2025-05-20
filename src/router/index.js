import {
    createRouter,
    createWebHashHistory,
  } from "vue-router";
  import Home from "@/views/home/index.vue"; // 导入组件
  
  const routes = [
    {
      path: "/", // 路径
      component: Home, // 对应的组件
    },
  ];
  
  const router = createRouter({
    // hash模式
    history: createWebHashHistory(),
    routes,
  });
  
  export default router;