<template>
  <transition name="slide-up">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end">
      <!-- Fondo oscuro -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" @click="close"></div>

      <!-- Contenedor principal -->
      <section
        class="relative w-full bg-[#FFF7EE] rounded-t-2xl shadow-2xl border-t border-[#FFD8A8]/70 overflow-hidden z-50"
        style="max-height:85vh; left:0; right:0;"
      >
        <!-- Header -->
        <header class="px-5 py-3 flex items-center justify-between border-b border-[#FFE1B0] bg-[#FFF4E8]">
          <h3 class="font-semibold text-lg text-[#A2642C]">
            Seleccionar artículos — <span class="text-[#E87C2A]">{{ category || 'Categoría' }}</span>
          </h3>
          <button
            class="cursor-pointer px-3 py-1 text-[#A2642C] hover:text-[#E87C2A] transition font-medium"
            @click="close"
          >
            Cerrar ✕
          </button>
        </header>

        <!-- Contenido -->
        <div class="p-4 overflow-y-auto" style="max-height:60vh;">
          <div v-if="loading" class="flex flex-col items-center justify-center py-10">
            <!-- Spinner grande -->
            <div class="w-16 h-16 border-4 border-[#FFE1B0] border-t-4 border-t-[#E87C2A] rounded-full animate-spin"></div>
            <div class="mt-4 text-sm font-medium text-[#A2642C]">Cargando artículos...</div>
          </div>
          <div v-else-if="loadError" class="text-center text-red-600 py-6">{{ loadError }}</div>
          <div v-else-if="!displayedItems || !displayedItems.length" class="text-center text-[#A2642C]/70 py-6">
            No hay artículos en esta categoría.
          </div>

          <ul class="space-y-3">
            <li
              v-for="it in displayedItems"
              :key="it.path"
              class="flex items-center gap-3 p-3 rounded-xl border border-[#FFD8A8]/70 bg-white hover:shadow-md hover:bg-[#FFF9F3] transition"
            >
              <img
                :src="it.imageUrl || it.image"
                alt="img"
                class="w-20 h-16 object-cover rounded-lg border border-[#FFE1B0]/80 shadow-sm"
              />

              <div class="flex-1">
                <div class="flex items-baseline justify-between gap-2">
                  <div>
                    <div class="font-semibold text-[#3B2C20] text-sm">
                      {{ it.title || it.nombre || it.name }}
                    </div>
                    <div class="text-xs text-[#5C3B1E]/70">
                      {{ it.descripcion || it.description || '' }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-[#E87C2A]">
                      {{ formatPrice(it.valor || it.price) }}
                    </div>
                    <div class="text-xs text-[#A2642C]/70">
                      {{ it.kilo ? 'Kilo' : (it.libra ? 'Libra' : (it.kilo === false && it.libra === false ? 'Unidad' : '')) }}
                    </div>
                  </div>
                </div>

                <!-- Controles -->
                <div class="mt-3 flex items-center justify-between">
                  <div
                    class="flex items-center gap-2 bg-[#FFF4E8] border border-[#FFD8A8]/70 px-2 py-1 rounded-lg"
                  >
                    <button
                      type="button"
                      class="cursor-pointer px-2 py-0.5 text-lg text-[#A2642C] hover:text-[#E87C2A] transition"
                      @click="decrease(it)"
                    >
                      −
                    </button>
                    <div class="w-10 text-center text-[#3B2C20] font-medium">{{ quantityFor(it) }}</div>
                    <button
                      type="button"
                      class="cursor-pointer px-2 py-0.5 text-lg text-[#A2642C] hover:text-[#E87C2A] transition"
                      @click="increase(it)"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    class="cursor-pointer px-4 py-1.5 rounded-lg bg-[#E87C2A] text-white text-sm font-medium hover:bg-[#D66E20] transition"
                    @click="addSingle(it)"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <footer class="px-5 py-3 border-t border-[#FFE1B0] bg-[#FFF4E8] flex items-center justify-between">
          <div class="text-sm text-[#3B2C20]">
            Seleccionados: <strong class="text-[#E87C2A]">{{ totalSelected }}</strong>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="cursor-pointer px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition font-medium"
              @click="close"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="cursor-pointer px-5 py-2 rounded-lg bg-[#E87C2A] text-white font-medium hover:bg-[#D66E20] transition"
              @click="commit"
            >
              Añadir al pedido
            </button>
          </div>
        </footer>
      </section>
    </div>
  </transition>
</template>

<script>
import { getProducts } from '@/services/productsService.js'

export default {
  name: 'BottomSheet',
  props: {
    open: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
    category: { type: String, default: '' }
  },
  data() {
    return {
      quantities: {},
      internalItems: [],
      loading: false,
      loadError: ''
    }
  },
  computed: {
    displayedItems() {
      return this.items?.length ? this.items : this.internalItems
    },
    totalSelected() {
      return Object.values(this.quantities).reduce((s, v) => s + (Number(v) || 0), 0)
    }
  },
  watch: {
    open(val) {
      if (!val) this.reset()
      if (val) {
        this.ensureQuantities()
        this.loadIfNeeded()
      }
    },
    items() { this.ensureQuantities() },
    category() { if (this.open) this.loadIfNeeded(true) }
  },
  methods: {
    ensureQuantities() {
      for (const it of this.displayedItems || [])
        if (typeof this.quantities[it.path] === 'undefined') this.quantities[it.path] = 0
    },
    quantityFor(it) { return Number(this.quantities[it.path] || 0) },
    increase(it) {
      const p = it.path
      this.quantities[p] = (Number(this.quantities[p]) || 0) + 1
    },
    decrease(it) {
      const p = it.path
      const cur = Number(this.quantities[p] || 0)
      if (cur > 0) this.quantities[p] = cur - 1
    },
    addSingle(it) {
      const p = it.path
      this.quantities[p] = (Number(this.quantities[p]) || 0) + 1
      this.commitSingle(it)
    },
    commitSingle(it) {
      const qty = Number(this.quantities[it.path] || 0)
      if (qty <= 0) return
      const entry = {
        path: it.path,
        title: it.title || it.nombre || it.name,
        qty,
        price: it.valor || it.price || 0,
        category: this.category
      }
      const existing = JSON.parse(sessionStorage.getItem('pedido') || '[]')
      existing.push(entry)
      sessionStorage.setItem('pedido', JSON.stringify(existing))
      this.$emit('added', entry)
      this.quantities[it.path] = 0
    },
    commit() {
      const selected = []
      for (const it of this.displayedItems || []) {
        const qty = Number(this.quantities[it.path] || 0)
        if (qty > 0)
          selected.push({
            path: it.path,
            title: it.title || it.nombre || it.name,
            qty,
            price: it.valor || it.price || 0,
            category: this.category
          })
      }
      if (!selected.length) return this.close()
      const existing = JSON.parse(sessionStorage.getItem('pedido') || '[]')
      sessionStorage.setItem('pedido', JSON.stringify(existing.concat(selected)))
      this.$emit('added-many', selected)
      this.close()
    },
    close() {
      this.$emit('close')
      this.$emit('update:open', false)
    },
    reset() {
      this.quantities = {}
      this.internalItems = []
      this.loading = false
      this.loadError = ''
    },
    formatPrice(v) {
      if (typeof v === 'undefined' || v === null) return '-'
      try {
        return '$ ' + new Intl.NumberFormat('es-CO').format(Number(v))
      } catch {
        return '$ ' + v
      }
    },
    async loadIfNeeded(force = false) {
      if (!force && this.items?.length) return
      const cat = (this.category || 'general').toString()
      if (!cat) return
      await this.loadItems(cat)
    },
    async loadItems(cat) {
      this.loading = true
      this.loadError = ''
      try {
        const list = await getProducts(cat)
        this.internalItems = list || []
        this.$nextTick(() => this.ensureQuantities())
      } catch (err) {
        console.error('Error cargando productos en BottomSheet:', err)
        this.loadError = 'Error cargando productos.'
        this.internalItems = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>


