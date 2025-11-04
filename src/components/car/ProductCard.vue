<template>
  <article class="card-hover rounded-xl2 shadow-soft bg-white overflow-hidden fade-in" @click="$emit('open', product)">
    <img :src="product.image" :alt="product.name" class="w-full h-40 object-cover" />

    <div class="p-4">
      <h3 class="font-semibold text-slate-900">{{ product.name }}</h3>
      <p class="text-sm text-slate-600 mt-1">{{ product.description }}</p>

      <div class="flex items-center justify-between mt-3">
        <span class="text-slate-900 font-bold">$ {{ formatPrice(product.price) }}</span>
        <span
          class="text-xs px-2 py-1 rounded-full"
          :class="badgeClass"
        >
          {{ product.status }}
        </span>
      </div>

      <button
        class="mt-4 w-full px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 transition disabled:opacity-50"
        :disabled="!isPurchasable"
        @click.stop="$emit('add', product)"
      >
        {{ isPurchasable ? 'Agregar al carrito' : statusLabel }}
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'ProductCard',
  emits: ['add', 'open'],
  props: { product: { type: Object, required: true } },
  computed: {
    isPurchasable() {
      return this.product.status === 'disponible' || this.product.status === 'activo';
    },
    statusLabel() {
      if (this.product.status === 'agotado') return 'Agotado';
      if (this.product.status === 'inactivo') return 'No disponible';
      return 'No disponible';
    },
    badgeClass() {
      const s = this.product.status;
      if (s === 'disponible' || s === 'activo') return 'bg-green-100 text-green-700';
      if (s === 'agotado') return 'bg-amber-100 text-amber-700';
      return 'bg-slate-100 text-slate-600';
    }
  },
  methods: {
    formatPrice(v) {
      return new Intl.NumberFormat('es-CO').format(v);
    }
  }
};
</script>
