<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-brand-500"></div>
        <h1 class="text-lg font-semibold text-slate-900">UNO MÁS DE LA FAMILIA</h1>
      </div>

      <nav class="flex items-center gap-6">
        <button
          class="relative px-4 py-2 rounded-full bg-brand-500 text-white hover:bg-brand-600 transition"
          @click="$emit('toggleCart')"
        >
          Carrito
          <span
            v-if="count > 0"
            class="absolute -top-2 -right-2 min-w-[1.5rem] h-6 px-1 rounded-full bg-slate-900 text-white text-xs grid place-items-center"
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
