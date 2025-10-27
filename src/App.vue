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
import Navbar from './components/Navbar.vue';
import CartSidebar from './components/CartSidebar.vue';
import HomeView from './views/HomeView.vue';
import { cart } from './store/cart';

export default {
  name: 'App',
  components: { Navbar, CartSidebar, HomeView },
  setup() {
    function handleAddToCart(product) {
      cart.add(product);
      cart.toggle(true);
    }
    return { cart, handleAddToCart };
  }
};
</script>
