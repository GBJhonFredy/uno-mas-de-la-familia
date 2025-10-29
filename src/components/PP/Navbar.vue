<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
    <div class="max-w-6xl mx-auto  flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class=" rounded-full bg-brand-500">
          <img class="text-lg font-semibold w-[100px]" src="/img/logo.png" alt="UNO MÁS DE LA FAMILIA">
        </div>

      </div>

      <nav class="flex items-center gap-6">
        <button
          class="relative  rounded-full bg-brand-500 text-black hover:bg-brand-600 transition"
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
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  props: { count: { type: Number, default: 0 } }
};
</script>
