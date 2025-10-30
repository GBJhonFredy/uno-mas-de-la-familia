<template>
  <div class="min-h-screen flex flex-col">
    <Navbar
      :count="cart.count"
      @toggleCart="cart.toggle(true)"
    />

    <main class="flex-1">
      <HomeView @addToCart="handleAddToCart" />
    </main>

    <CartSidebar
      :open="cart.state.isOpen"
      :items="cart.state.items"
      :total="cart.total"
      @close="cart.toggle(false)"
      @remove="cart.remove"
      @decrease="cart.decrease"
    />
  </div>
</template>

<script>
import Navbar from './components/PP/Navbar.vue';
import Slider from './components/PP/Slide.vue';
import Proveedores from './components/PP/Proveedores.vue';

import BtnAdmin from './components/admin/BtnAdmin.vue';
import Modalcreate from './components/admin/Modalcreate.vue';
import ListSlides from './components/admin/ListSlides.vue';
import ModalCreateProveedor from './components/admin/ModalCreateProveedor.vue';
import BottomSheetProduct from './components/admin/BottomSheetProduct.vue';

import CartSidebar from './components/car/CartSidebar.vue';
import HomeView from './views/HomeView.vue';
import { cart } from './store/cart';


export default {
  name: 'App',
  components: { Navbar, Slider, BtnAdmin, Modalcreate, ListSlides, CartSidebar, HomeView, Proveedores, ModalCreateProveedor , BottomSheetProduct },
  setup() {
    function handleAddToCart(product) {
      cart.add(product);
      cart.toggle(true);
    }
    return { cart, handleAddToCart };
  }
};
</script>
