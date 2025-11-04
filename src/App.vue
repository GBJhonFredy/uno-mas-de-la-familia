<template>
  <div class="min-h-screen flex flex-col">
    <Navbar
      :count="count"
      @toggleCart="cart.toggle(true)"
    />

    <main class="flex-1">
      <HomeView @addToCart="handleAddToCart" />
    </main>

    <CartSidebar
      :open="cart.state.isOpen"
      :items="cart.state.items"
      :total="total"
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
import ModalList from './components/admin/ModalList.vue';
import ModalEdit from './components/admin/ModalEdit.vue';
import ModalCreate from './components/admin/ModalCreate.vue';

import CartSidebar from './components/car/CartSidebar.vue';
import HomeView from './views/HomeView.vue';
import { cart } from './store/cart';


export default {
  name: 'App',
  components: { Navbar, Slider, BtnAdmin, ModalList, CartSidebar, HomeView, Proveedores, ModalCreate, ModalEdit },
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
    return { cart, handleAddToCart, count, total };
  }
};
</script>
