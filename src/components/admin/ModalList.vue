<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" style="padding-top: 6rem;">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

    <div class="relative w-full max-w-6xl mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/70 p-0 overflow-hidden h-[80vh]">
      <!-- Header sticky -->
      <header class="flex justify-between items-center mb-0 border-b border-[#FFE1B0] px-6 pt-6 pb-3 sticky top-0 bg-[#FFF7EE] z-20">
        <h2 class="text-xl font-semibold text-[#3B2C20]">{{ headerTitle }}</h2>
        <div class="flex items-center gap-3">
          <button @click="$emit('close')" class="p-2 rounded-full hover:bg-[#FFE3C6] transition" title="Cerrar">
            <img src="/img/cancel-close-svgrepo-com.svg" class="w-5 h-5" alt="Cerrar" />
          </button>
        </div>
      </header>

      <!-- Filtros -->
      <div class="sticky top-[64px] z-10 bg-[#FFF7EE] px-6 pt-3 pb-3 border-b border-[#FFE1B0]">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <label class="text-sm text-[#3B2C20]">Mostrar</label>
            <select v-model.number="rowsPerPage" class="border border-[#E3B991] rounded-md px-2 py-1 text-sm bg-white">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <span class="text-sm text-[#3B2C20]">por página</span>
          </div>

          <input
            v-model="search"
            type="text"
            placeholder="Buscar..."
            class="border border-[#E3B991] bg-white rounded-full px-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-[#E87C2A]/40 outline-none"
          />

          <div
            class="flex items-center gap-2 px-2 py-1 rounded-full border border-[#E3B991] bg-white shadow-sm"
            role="navigation"
            aria-label="Paginación"
          >
            <button
              class="p-2 rounded-full border border-[#E3B991] bg-white hover:bg-[#FFE1C0] transition disabled:opacity-50"
              :disabled="page === 1"
              @click="prevPage"
              title="Anterior"
              aria-label="Anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#A2642C]" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
              </svg>
            </button>

            <span class="text-xs sm:text-sm text-[#3B2C20] px-2 py-1 rounded-full bg-[#FFF7EE] border border-[#E3B991]">
              {{ page }} / {{ totalPages || 1 }}
            </span>

            <button
              class="p-2 rounded-full border border-[#E3B991] bg-white hover:bg-[#FFE1C0] transition disabled:opacity-50"
              :disabled="page === totalPages || totalPages === 0"
              @click="nextPage"
              title="Siguiente"
              aria-label="Siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#A2642C]" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div v-if="loading" class="text-center py-10 text-[#A2642C] animate-pulse">Cargando datos...</div>
      <div v-else class="rounded-2xl border border-[#FFE1B0] mx-6 my-4 overflow-visible relative">
        <div ref="tableScroll" class="max-h-[52vh] overflow-y-auto relative" @scroll="handleScrollableScroll">
          <table class="w-full text-sm">
            <thead class="bg-[#FFF1E4] text-[#3B2C20] font-semibold sticky top-0 z-10">
              <tr>
                <th class="p-3 text-left">Imagen</th>
                <th class="p-3 text-left">Título / Nombre</th>
                <!-- Productos: columnas específicas -->
                <th v-if="type === 'product'" class="p-3 text-center">Valor</th>
                <th v-if="type === 'product'" class="p-3 text-center">Estado</th>
                <th v-if="showEmpaquetadoCol" class="p-3 text-center">Empaquetado/Granel</th>
                <th v-if="showKiloCol" class="p-3 text-center">Peso</th>
                <!-- Slides/Proveedores: descripción/meta -->
                <th v-if="type !== 'product'" class="p-3 text-left">Descripción / Meta</th>
                <th v-if="showPublishedCol" class="p-3 text-center">Publicado</th>
                <th class="p-3 text-center w-20">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in currentPageItems" :key="item.path" class="border-t border-[#FFE1B0] hover:bg-[#FFF8F2] transition">
                <td class="p-3">
                  <img :src="item.imageUrl" alt="preview" class="w-24 h-16 object-cover rounded-lg border border-[#FFD8A8]/60 shadow-sm" />
                </td>
                <td class="p-3 align-top font-medium text-[#3B2C20]">{{ item.title || item.nombre || item.titulo }}</td>
                <!-- Si es producto mostramos columnas: valor, disponible, empaquetado, kilo -->
                <td v-if="type === 'product'" class="p-3 text-center">{{ item.valor ? ('$' + item.valor) : '-' }}</td>
                <td v-if="type === 'product'" class="p-3 text-center">
                  <span class="inline-block px-2 py-1 text-xs rounded-full font-semibold" :class="item.disponible === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">{{ item.disponible === false ? 'Agotado' : 'Disponible' }}</span>
                </td>
                <td v-if="showEmpaquetadoCol" class="p-3 text-center">
                  <span class="inline-block px-2 py-1 text-xs rounded-full font-semibold" :class="item.empaquetado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ item.empaquetado ? 'Granel' : 'Empaquetado' }}</span>
                </td>
                <td v-if="showKiloCol" class="p-3 text-center">
                  <span class="inline-block px-2 py-1 text-xs rounded-full font-semibold" :class="item.kilo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ item.kilo ? 'Kilo' : 'Libra' }}</span>
                </td>
                <!-- Si no es producto mostramos descripción/meta -->
                <td v-if="type !== 'product'" class="p-3 align-top text-[#5C3B1E]/80">{{ item.text || item.descripcion || (item.valor ? ('$' + item.valor) : '') }}</td>
                <td v-if="showPublishedCol" class="p-3 text-center">
                  <span class="inline-block px-2 py-1 text-xs rounded-full font-semibold" :class="item.published ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ item.published ? 'Sí' : 'No' }}</span>
                </td>
                <td class="p-3 text-center relative">
                  <button :ref="el => (buttonRefs[item.path] = el)" @click="openContextMenu(item, $event)" class="p-2 rounded-full border border-[#E3B991] bg-white hover:bg-[#FFE1C0] transition">
                    <i class="fas fa-ellipsis-v text-[#A2642C]"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="!items.length && !loading" class="text-center text-[#A2642C] py-6">No hay registros.</div>
    </div>
  </div>

  <!-- Menú contextual -->
  <teleport to="body">
    <transition name="fade">
      <div v-if="menuOpen" class="fixed z-9999" :style="menuStyle" @click.stop>
        <div class="w-40 bg-white border border-[#FFD8A8] rounded-lg shadow-xl overflow-hidden">
          <button v-if="canEdit" class="block w-full text-left px-3 py-2 text-sm hover:bg-[#FFF1E4]" @click="handleEditFromMenu">Editar</button>
          <button v-if="canDelete" class="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50" @click="handleDeleteFromMenu">Eliminar</button>
        </div>
      </div>
    </transition>
  </teleport>

  <!-- Modal de edición -->
    <!-- Modal de edición -->
  <ModalEdit
    v-if="editOpen && currentItem && (type === 'slide' || type === 'product')"
    :open="editOpen"
    :type="type"
    :item="currentItem"
    @close="editOpen = false"
    @updated="handleUpdated"
  />
  <ModalCreate
    v-if="editOpen && currentItem && type === 'proveedor'"
    :open="editOpen"
    :type="'proveedor'"
    :initial="currentItem"
    :category="category"
    @close="editOpen = false"
    @updated="handleUpdated"
  />

</template>

<script>
import ModalEdit from '@/components/admin/ModalEdit.vue'
import ModalCreate from '@/components/admin/ModalCreate.vue'
import { listenSlides, deleteSlideById } from '@/services/slidesService.js'
import { getProducts, deleteProduct } from '@/services/productsService.js'
import { getproveedores, deleteProveedor } from '@/services/proveedoresService.js'

export default {
  name: 'ModalList',
  components: { ModalEdit, ModalCreate },
  props: { open: Boolean, type: { type: String, default: 'slide' }, category: String },
  emits: ['close', 'edit', 'updated'], // ← AGREGA ESTO
  data() {
    return {
      items: [],
      loading: true,
      rowsPerPage: 5,
      search: '',
      page: 1,
      unsub: null,
      menuOpen: false,
      menuForItem: null,
      menuPos: { x: 0, y: 0 },
      buttonRefs: Object.create(null),
      editOpen: false,
      currentItem: null
    }
  },
  computed: {
    headerTitle() {
      if (this.type === 'slide') return 'Administrador de Slides'
      if (this.type === 'product') return `Productos ${this.category ? '- ' + this.category : ''}`
      if (this.type === 'proveedor') return 'Proveedores'
      return 'Lista'
    },
    showPublishedCol() { return this.type === 'slide' || this.type === 'proveedor' },
    showValorCol() { return this.type === 'product' },
    // Columnas específicas para productos según categoría
    showEmpaquetadoCol() {
      return this.type === 'product' && String(this.category || '').toLowerCase() === 'alimentos'
    },
    showKiloCol() {
      return this.type === 'product' && String(this.category || '').toLowerCase() === 'alimentos'
    },
    filteredItems() {
      const q = (this.search || '').toLowerCase()
      return this.items.filter(i => {
        const title = (i.title || i.nombre || i.titulo || '').toLowerCase()
        const text = (i.text || i.descripcion || '').toLowerCase()
        return title.includes(q) || text.includes(q)
      })
    },
    totalPages() { return Math.ceil(this.filteredItems.length / this.rowsPerPage) || 0 },
    currentPageItems() {
      const start = (this.page - 1) * this.rowsPerPage
      return this.filteredItems.slice(start, start + this.rowsPerPage)
    },
  canEdit() { return this.type === 'slide' || this.type === 'product' || this.type === 'proveedor' },
  canDelete() { return this.type === 'slide' || this.type === 'product' || this.type === 'proveedor' },
    menuStyle() { return { top: `${this.menuPos.y}px`, left: `${this.menuPos.x}px` } }
  },
  async mounted() {
    // Escuchador global de clicks SIN fase de captura para permitir que los
    // clicks dentro del menú (que usan @click.stop) puedan prevenir el cierre.
    document.addEventListener('click', this.handleGlobalClick)
    // Solo cargamos datos si el modal ya está abierto en el montaje.
    if (this.open) await this.loadData()
  },
  beforeUnmount() {
    if (this.unsub) this.unsub()
    document.removeEventListener('click', this.handleGlobalClick)
  },
  watch: {
    // Cuando se abre el modal, recargamos la lista (y la categoría actual)
    async open(val) {
      if (val) {
        // resetear paginación/estado y cargar con la categoría actual
        this.page = 1
        this.items = []
        await this.loadData()
      } else {
        // al cerrar limpiamos para evitar que queden items "pegados"
        this.items = []
        this.page = 1
        this.loading = false
      }
    },
    // Si cambia la categoría mientras el modal está abierto, recargamos
    async category() {
      if (this.open) {
        this.page = 1
        this.items = []
        await this.loadData()
      }
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      this.items = []
      try {
        if (this.type === 'slide') {
          if (this.unsub) this.unsub()
          this.unsub = listenSlides(slides => {
            this.items = slides
            this.loading = false
            this.page = 1
          }, { includeUnpublished: true })
        } else if (this.type === 'product') {
          this.items = await getProducts(this.category || 'general')
          this.loading = false
        } else if (this.type === 'proveedor') {
          this.items = await getproveedores()
          this.loading = false
        } else this.loading = false
      } catch (err) {
        console.error('Error cargando lista', err)
        this.loading = false
      }
    },
    handleScrollableScroll() { if (this.menuOpen) this.closeMenu() },
    openContextMenu(item, e) {
      this.menuForItem = item
      const btn = this.buttonRefs[item.path]
      const menuWidth = 160
      const approxMenuHeight = 110
      const vw = window.innerWidth
      const vh = window.innerHeight

      let left = Math.max(8, (vw - menuWidth) / 2)
      let top = Math.max(8, (vh - approxMenuHeight) / 2)

      if (btn) {
        const rect = btn.getBoundingClientRect()
        left = rect.right - menuWidth
        top = rect.bottom + 6
        if (left + menuWidth > vw) left = vw - menuWidth - 8
        if (left < 8) left = rect.left + 6
        if (top + approxMenuHeight > vh) top = rect.top - approxMenuHeight
      } else if (e && e.clientX && e.clientY) {
        // Fallback: posicionar cerca del cursor
        left = Math.min(Math.max(8, e.clientX - menuWidth / 2), vw - menuWidth - 8)
        top = Math.min(Math.max(8, e.clientY + 12), vh - approxMenuHeight - 8)
      }

      console.log('ModalList: opening menu for', item && item.path, { left, top })
      this.menuPos = { x: left, y: top }
      this.menuOpen = true
    },
    closeMenu() { this.menuOpen = false; this.menuForItem = null },
    handleGlobalClick(e) {
      if (!this.menuOpen) return
      const isOnAnyButton = Object.values(this.buttonRefs).some(btn => btn && btn.contains(e.target))
      if (isOnAnyButton) return
      this.closeMenu()
    },
    handleEditFromMenu() {
      if (this.menuForItem) {
        console.log('ModalList: handleEditFromMenu ->', this.menuForItem)
        this.currentItem = this.menuForItem
        // Forzamos apertura en nextTick para evitar condiciones de carrera
        this.$nextTick(() => { this.editOpen = true })
        this.$emit('edit', this.menuForItem)
      }
      this.closeMenu()
    },
    handleDeleteFromMenu() {
      if (this.menuForItem) this.deleteItem(this.menuForItem)
      this.closeMenu()
    },
    handleUpdated(updated) {
      const i = this.items.findIndex(s => s.path === this.currentItem?.path)
      if (i !== -1) this.items[i] = { ...this.items[i], ...updated }
    },
    async deleteItem(item) {
      if (!confirm(`¿Eliminar "${item.title || item.nombre || item.titulo}"?`)) return
      try {
        if (this.type === 'slide') {
          await deleteSlideById(item.path)
          this.items = this.items.filter(i => i.path !== item.path)
        } else if (this.type === 'product') {
          await deleteProduct(this.category || 'general', item.path)
          this.items = this.items.filter(i => i.path !== item.path)
        } else if (this.type === 'proveedor') {
          await deleteProveedor(item.path)
          this.items = this.items.filter(i => i.path !== item.path)
        }
        if (this.currentPageItems.length === 0 && this.page > 1) this.page--
      } catch (err) {
        console.error('Error eliminando', err)
      }
    },
    nextPage() { if (this.page < this.totalPages) this.page++ },
    prevPage() { if (this.page > 1) this.page-- }
  }
}
</script>

