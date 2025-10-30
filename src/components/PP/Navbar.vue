<template>
  <header class="headerUMDF sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
    <div class="max-w-6xl sm:px-5 mx-auto  flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class=" rounded-full bg-brand-500">
          <img class="text-lg font-semibold w-[100px]" src="/img/logo.webp" alt="UNO MÁS DE LA FAMILIA">
        </div>

      </div>

      <nav class="flex items-center gap-6">
         <a href="#inicio" class="hover:text-[#E87C2A] transition-colors">Inicio</a>
      <a href="#productos" class="hover:text-[#E87C2A] transition-colors">Productos</a>
      <a href="#contacto" class="hover:text-[#E87C2A] transition-colors">Contacto</a>
        <button
          class="relative hover:text-[#E87C2A] transition-colors cursor-pointer rounded-full bg-brand-500 text-black hover:bg-brand-600 transition"
          @click="$emit('toggleCart')"
        >
          Carrito
          <span
            v-if="count > 0"
            class="absolute -top-2 -right-2 min-w-[1.5rem] h-6 px-1 rounded-full bg-slate-900 text-black text-xs grid place-items-center"
          >{{ count }}</span>
        </button>
      </nav>
    </div>
    <div class="h-[2px] bg-gradient-to-r from-[#E87C2A] via-[#F3C382] to-[#C76B2D]"></div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  props: { count: { type: Number, default: 0 } }
};
</script>
