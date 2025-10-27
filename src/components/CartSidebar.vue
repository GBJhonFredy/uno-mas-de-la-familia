<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="open"
      class="fixed inset-0 bg-black/30"
      @click="$emit('close')"
    ></div>

    <!-- Panel -->
    <aside
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl border-l border-slate-100
             flex flex-col"
      :class="open ? 'slide-in-right' : 'slide-out-right'"
      v-show="open"
    >
      <header class="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="font-semibold text-slate-900">Tu carrito</h2>
        <button class="text-slate-500 hover:text-slate-900" @click="$emit('close')">Cerrar</button>
      </header>

      <section class="flex-1 overflow-auto p-4 space-y-4">
        <div v-if="!items.length" class="text-slate-600">Sin productos aún.</div>

        <div
          v-for="it in items"
          :key="it.id"
          class="flex items-center gap-3 p-3 rounded-xl border border-slate-100"
        >
          <img :src="it.image" :alt="it.name" class="w-14 h-14 rounded-lg object-cover" />
          <div class="flex-1">
            <div class="font-medium text-slate-900">{{ it.name }}</div>
            <div class="text-sm text-slate-600">$ {{ fmt(it.price) }} x {{ it.qty }}</div>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-2 py-1 border rounded" @click="$emit('decrease', it.id)">−</button>
            <button class="px-2 py-1 border rounded" @click="$emit('remove', it.id)">Eliminar</button>
          </div>
        </div>
      </section>

      <footer class="p-4 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <span class="text-slate-600">Total</span>
          <span class="text-lg font-semibold text-slate-900">$ {{ fmt(total) }}</span>
        </div>
        <button
          class="mt-3 w-full px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition"
          @click="$emit('close')"
        >
          Continuar
        </button>
      </footer>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'CartSidebar',
  props: {
    open: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
    total: { type: Number, default: 0 }
  },
  methods: {
    fmt(v) { return new Intl.NumberFormat('es-CO').format(v); }
  }
};
</script>
