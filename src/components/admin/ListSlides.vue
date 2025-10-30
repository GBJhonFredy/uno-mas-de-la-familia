<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Fondo -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Contenedor -->
    <div
      class="relative w-full max-w-6xl mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/70 p-6 overflow-y-auto max-h-[90vh]"
    >
      <!-- Header -->
      <header class="flex justify-between items-center mb-5 border-b border-[#FFE1B0] pb-3">
        <h2 class="text-xl font-semibold text-[#3B2C20]">
          Administrador de Slides
        </h2>

        <div class="flex items-center gap-3">

          <button
            @click="$emit('close')"
            class="p-2 rounded-full hover:bg-[#FFEBD3] transition"
            title="Cerrar"
          >
            <img src="/img/cancel-close-svgrepo-com.svg" class="w-5 h-5" alt="Cerrar" />
          </button>
        </div>
      </header>

      <!-- Barra superior -->
      <div class="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div class="flex items-center gap-2">
          <label class="text-sm text-[#3B2C20]">Mostrar</label>
          <select v-model="rowsPerPage" class="border border-[#E3B991] rounded-md px-2 py-1 text-sm bg-white">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
          <span class="text-sm text-[#3B2C20]">por página</span>
        </div>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar... (título o descripción)"
          class="border border-[#E3B991] bg-white rounded-full px-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-[#E87C2A]/40 outline-none"
        />
      </div>

      <!-- Loader -->
      <div v-if="loading" class="text-center py-10 text-[#A2642C] animate-pulse">
        Cargando slides...
      </div>

      <!-- Tabla -->
      <div v-else class="rounded-2xl border border-[#FFE1B0] overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-[#FFF1E4] text-[#3B2C20] font-semibold">
            <tr>
              <th class="p-3 text-left">Imagen</th>
              <th class="p-3 text-left">Título</th>
              <th class="p-3 text-left">Descripción</th>
              <th class="p-3 text-center">Publicado</th>
              <th class="p-3 text-center w-20">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredSlides"
              :key="item.id"
              class="border-t border-[#FFE1B0] hover:bg-[#FFF8F2] transition"
            >
              <td class="p-3">
                <img
                  :src="item.imageUrl"
                  alt="preview"
                  class="w-24 h-16 object-cover rounded-lg border border-[#FFD8A8]/60 shadow-sm"
                />
              </td>
              <td class="p-3 align-top font-medium text-[#3B2C20]">{{ item.title }}</td>
              <td class="p-3 align-top text-[#5C3B1E]/80">{{ item.text }}</td>
              <td class="p-3 text-center">
                <span
                  class="inline-block px-2 py-1 text-xs rounded-full font-semibold"
                  :class="item.published ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ item.published ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="p-3 text-center">
                <div class="relative inline-block text-left">
                  <button
                    @click="toggleMenu(item.id)"
                    class="p-2 rounded-full hover:bg-[#FFEBD3] transition"
                  >
                    <i class="fas fa-ellipsis-v text-[#A2642C]"></i>
                  </button>

                  <transition name="fade">
                    <div
                      v-if="menuOpen === item.id"
                      class="absolute right-0 mt-2 w-32 bg-white border border-[#FFD8A8] rounded-lg shadow-lg z-10"
                    >
                      <button
                        class="block w-full text-left px-3 py-2 text-sm hover:bg-[#FFF1E4]"
                        @click="editSlide(item)"
                      >
                        Editar
                      </button>
                      <button
                        class="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        @click="deleteSlide(item)"
                      >
                        Eliminar
                      </button>
                    </div>
                  </transition>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Sin datos -->
      <div v-if="!slides.length && !loading" class="text-center text-[#A2642C] py-6">
        No hay slides registrados.
      </div>
    </div>
  </div>
</template>

<script>
import { getSlides, deleteSlideById } from '@/services/slidesService.js'

export default {
  name: 'ListSlides',
  emits: ['close', 'edit'],
  data() {
    return {
      slides: [],
      loading: true,
      menuOpen: null,
      rowsPerPage: 5,
      search: ''
    }
  },
  computed: {
    filteredSlides() {
      return this.slides
        .filter(
          s =>
            s.title.toLowerCase().includes(this.search.toLowerCase()) ||
            s.text.toLowerCase().includes(this.search.toLowerCase())
        )
        .slice(0, this.rowsPerPage)
    }
  },
  async mounted() {
    try {
      this.slides = await getSlides()
    } catch (e) {
      console.error('Error al obtener slides', e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    toggleMenu(id) {
      this.menuOpen = this.menuOpen === id ? null : id
    },
    editSlide(item) {
      this.$emit('edit', item)
      this.menuOpen = null
    },
    async deleteSlide(item) {
      if (!confirm(`¿Eliminar "${item.title}"?`)) return
      try {
        await deleteSlideById(item.id)
        this.slides = this.slides.filter(s => s.id !== item.id)
      } catch (e) {
        console.error('Error al eliminar', e)
      }
      this.menuOpen = null
    },
    openCreateModal() {
      this.$emit('create')
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
