<template>
  <header
    class="sticky top-0 z-[1000] bg-[#FFF7EE]/90 backdrop-blur-md border-b border-[#FFD8A8]/70 shadow-sm">
    <div
      class="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5">
      <!-- LOGO -->
      <a href="#inicio" class="flex items-center">
        <img
          src="/img/logo.webp"
          alt="UNO MÁS DE LA FAMILIA"
          class="w-[95px] h-auto object-contain" />
      </a>

      <!-- NAV LINKS -->
      <nav class="hidden sm:flex items-center gap-6 text-[#3B2C20] text-sm font-medium">
        <a href="#inicio" class="hover:text-[#E87C2A] transition-colors">Inicio</a>
        <a href="#productos" class="hover:text-[#E87C2A] transition-colors">Productos</a>
        <a href="#contacto" class="hover:text-[#E87C2A] transition-colors">Contacto</a>
      </nav>

      <!-- ICONOS DERECHA -->
      <div class="flex items-center gap-3">
        <!-- BOTÓN ADMIN -->
        <div class="relative">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-[#A2642C] hover:text-[#E87C2A] transition-colors cursor-pointer bg-[#FFF1E4] border border-[#FFD8A8]/70 hover:bg-[#FFF0DA]"
            @click="handleAdminClick"
            :aria-expanded="showAdminMenu ? 'true' : 'false'"
            aria-haspopup="true">
            <template v-if="!isAdmin">
              <img
                src="/img/light-config-svgrepo-com.svg"
                alt="Ajustes"
                class="w-5 h-5" />
            </template>
            <template v-else>
              <!-- Nuevo ícono de usuario -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3-7 8-7s8 3 8 7" />
              </svg>
              <span class="font-medium text-xs">webmaster</span>
            </template>
          </button>

          <!-- SUBMENÚ ADMIN -->
          <transition name="fade">
            <div v-if="showAdminMenu" class="absolute right-0 mt-2 w-40 bg-[#FFF7EE] border border-[#FFD8A8]/70 rounded-xl shadow-xl overflow-hidden z-[1001]" @click.stop>
              <button type="button" class="w-full text-left px-4 py-2 text-sm text-[#A2642C] hover:bg-[#FFF0DA] transition-colors cursor-pointer flex items-center gap-2" @click="doLogout">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#E87C2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </transition>
        </div>

        <!-- BOTÓN CARRITO -->
        <button class="relative cursor-pointer flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-[#A2642C] hover:text-[#E87C2A] bg-[#FFF1E4] border border-[#FFD8A8]/70 hover:bg-[#FFF0DA] transition-colors" @click="$emit('toggleCart')" title="Ver carrito">
          <img src="/img/trolley-store-cart-shop-market-svgrepo-com.svg" alt="Carrito" class="w-5 h-5" />
          <span v-if="count > 0" class="absolute -top-1 -right-1 min-w-[1.2rem] h-5 px-[2px] rounded-full bg-[#E87C2A] text-white font-bold text-[10px] grid place-items-center border border-[#FFD8A8]">
            {{ count }}
          </span>
        </button>
      </div>
    </div>

    <!-- LÍNEA DECORATIVA -->
    <div class="h-[2px] bg-gradient-to-r from-[#E87C2A] via-[#F3C382] to-[#C76B2D]"></div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    count: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false }
  },
  data() {
    return { showAdminMenu: false }
  },
  methods: {
    handleAdminClick() {
      if (this.isAdmin) this.showAdminMenu = !this.showAdminMenu
      else this.$emit('open-login')
    },
    doLogout() {
      this.showAdminMenu = false
      window.dispatchEvent(new CustomEvent('umdf:logout')) // activa el modal
      this.$emit('request-logout')
    },
    closeAdminMenuIfOutside(e) {
      if (!this.$el.contains(e.target)) this.showAdminMenu = false
    }
  },
  mounted() {
    window.addEventListener('click', this.closeAdminMenuIfOutside)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.closeAdminMenuIfOutside)
  }
}
</script>
