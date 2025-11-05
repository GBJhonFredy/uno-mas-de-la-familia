<template>
  <div class="min-h-screen flex flex-col">
    <Navbar
      :count="count"
      :is-admin="isAdmin"
      @toggleCart="cart.toggle(true)"
  @open-login="openLogin = true"
  @request-logout="requestLogout" />

    <main class="flex-1">
      <HomeView @addToCart="handleAddToCart" @open-login="openLogin = true" />
    </main>

    <!-- Login modal controlado por App -->
    <LoginModal :open="openLogin" @close="openLogin = false" @logged="() => { openLogin = false }" />

    <CartSidebar
      :open="cart.state.isOpen"
      :items="cart.state.items"
      :total="total"
      @close="cart.toggle(false)"
      @remove="cart.remove"
      @decrease="cart.decrease" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Navbar from './components/PP/Navbar.vue';
import Slider from './components/PP/Slide.vue';
import Proveedores from './components/PP/Proveedores.vue';

import BtnAdmin from './components/admin/BtnAdmin.vue';
import ModalList from './components/admin/ModalList.vue';
import ModalEdit from './components/admin/ModalEdit.vue';
import ModalCreate from './components/admin/ModalCreate.vue';
import LoginModal from './components/admin/LoginModal.vue'

import CartSidebar from './components/car/CartSidebar.vue';
import HomeView from './views/HomeView.vue';
import { cart } from './store/cart';


export default {
  name: 'App',
  components: { Navbar, Slider, BtnAdmin, ModalList, CartSidebar, HomeView, Proveedores, ModalCreate, ModalEdit, LoginModal },
  setup() {
    function handleAddToCart(product) {
      cart.add(product);
      cart.toggle(true);
    }
    // Exponer count/total como propiedades de primer nivel para
    // que Vue pueda hacer el unwrapping automático en el template
    // y evitar pasar objetos Ref anidados a componentes hijos.
    const count = cart.count
    const total = cart.total
    // login modal state
    const openLogin = ref(false)
    const isAdmin = ref(Boolean(sessionStorage.getItem('umdf_logged')))

    // Escuchar evento global de login/logout para actualizar la UI
    const onLogin = () => { isAdmin.value = true }
    const onLogout = () => { isAdmin.value = false }
    onMounted(() => {
      window.addEventListener('umdf:login', onLogin)
      window.addEventListener('umdf:logout', onLogout)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('umdf:login', onLogin)
      window.removeEventListener('umdf:logout', onLogout)
    })

    // abrir modal de login
    const openLoginModal = () => { openLogin.value = true }

    const requestLogout = () => {
      try { sessionStorage.removeItem('umdf_logged') } catch (e) {}
      isAdmin.value = false
      window.dispatchEvent(new CustomEvent('umdf:logout'))
    }

    return { cart, handleAddToCart, count, total, openLogin, isAdmin, openLoginModal, requestLogout };
  }
};
</script>
