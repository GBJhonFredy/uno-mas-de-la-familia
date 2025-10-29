<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
      <header class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-slate-800">Listado de Slides</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-slate-100 transition"
          title="Cerrar"
        >
          <img src="/img/cancel-close-svgrepo-com.svg" class="w-5 h-5" alt="Cerrar" />
        </button>
      </header>

      <!-- 🔹 Loader -->
      <div v-if="loading" class="text-center py-10 text-slate-500 animate-pulse">
        Cargando slides...
      </div>

      <!-- 🔹 Tabla -->
      <table v-else class="w-full text-sm border-collapse">
        <thead class="bg-slate-50 border-b">
          <tr class="text-left text-slate-700 font-medium">
            <th class="p-3 w-24">Imagen</th>
            <th class="p-3">Título</th>
            <th class="p-3">Descripción</th>
            <th class="p-3 w-24 text-center">Publicado</th>
            <th class="p-3 w-12"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in slides"
            :key="item.id"
            class="border-b hover:bg-slate-50 transition"
          >
            <td class="p-3">
              <img
                :src="item.imageUrl"
                alt="preview"
                class="w-20 h-14 object-cover rounded-md ring-1 ring-slate-200"
              />
            </td>
            <td class="p-3 align-top font-medium">{{ item.title }}</td>
            <td class="p-3 align-top text-slate-600">{{ item.text }}</td>
            <td class="p-3 text-center">
              <span
                class="inline-block px-2 py-1 text-xs rounded-full font-semibold"
                :class="item.published ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ item.published ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="p-3 text-right relative">
              <!-- Botón de acciones -->
              <div class="relative inline-block text-left">
                <button
                  @click="toggleMenu(item.id)"
                  class="p-2 rounded-full hover:bg-slate-100 focus:outline-none"
                >
                  <i class="fas fa-ellipsis-v text-slate-500"></i>
                </button>

                <transition name="fade">
                  <div
                    v-if="menuOpen === item.id"
                    class="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
                  >
                    <button
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100"
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

      <div v-if="!slides.length && !loading" class="text-center text-slate-500 py-6">
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
      menuOpen: null
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
