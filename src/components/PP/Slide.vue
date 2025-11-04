<template>
  <!-- SLIDER -->
  <div data-aos="zoom-in"  class="sliderPP max-w-5xl mx-auto rounded-2xl fade-in relative min-h-[420px] flex items-center justify-center">

    <!-- 🔹 Botón de herramientas para admin -->
    <div class="absolute top-4 right-6 z-50">
      <BtnAdmin
        :actions="[
          { label: 'Nuevo', title: 'Agregar Slide', icon: '/img/upload-svgrepo-com.svg', event: 'add' },
          { label: 'Ver Lista', title: 'Ver Lista', icon: '/img/list-check-box-svgrepo-com.svg', event: 'view' }
        ]"
        @action="handleAdminAction" />
    </div>

    <!-- 🔹 Loader mientras carga -->
    <div v-if="loadingSlides" class="flex flex-col items-center justify-center text-slate-500 animate-pulse">
      <svg class="w-12 h-12 mb-3 text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582M20 20v-5h-.581M9 19H4v-5m16 5h-5m-6-6V9m0 0V4m0 5h5m-5 0H4" />
      </svg>
      <p class="text-sm">Cargando imágenes...</p>
    </div>

    <!-- 🔹 Mensaje si no hay publicaciones -->
    <div v-else-if="!slides.length" role="status" aria-live="polite"
      class="sliderEmpty ph-empty text-center p-8 max-w-md mx-auto z-10 relative">
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
          <i class="fas fa-image text-3xl text-gray-400"></i>
        </div>
      </div>
      <h2 class="text-3xl text-gray-700 font-bold mb-4 leading-tight">
        Por el momento no tenemos publicaciones
      </h2>
      <p class="text-gray-600 text-lg mb-6 leading-relaxed">
        Estamos trabajando para traerte contenido increíble muy pronto
      </p>
      <div class="flex items-center justify-center text-gray-500">
        <i class="fas fa-clock mr-2"></i>
        <span class="text-sm">Mantente atento a las novedades</span>
      </div>
    </div>

    <!-- 🔹 Slider cuando hay imágenes -->
    <Splide v-else
      :options="splideOptions"
      aria-label="Galería principal"
      class="rounded-2xl overflow-hidden shadow-xl w-full">
      <SplideSlide v-for="(slide, i) in slides" :key="i">
        <div class="relative group">
          <img
            :src="slide.imageUrl"
            :alt="slide.title"
            loading="lazy"
            decoding="async"
            class="w-full h-[420px] object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 p-6 text-white">
            <h3 class="text-2xl font-semibold">{{ slide.title }}</h3>
            <p class="text-sm text-white/80">{{ slide.text }}</p>
          </div>
        </div>
      </SplideSlide>
    </Splide>
  </div>

  <ModalCreateDynamic v-if="showModal" :open="showModal" type="slide" @close="closeModal" />
  <ListSlides v-if="showList" @close="closeList" @edit="onEditSlide" />

</template>
<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { getSlides, listenSlides } from '@/services/slidesService.js'
import { splideOptions } from '@/data/homeData.js'
import BtnAdmin from '@/components/admin/BtnAdmin.vue'
import ModalCreateDynamic from '@/components/admin/ModalCreateDynamic.vue'
import ListSlides from '../admin/ListSlides.vue'

export default {
  name: 'Slider',
  components: { Splide, SplideSlide, BtnAdmin, ModalCreateDynamic, ListSlides },
  data() {
    return {
      slides: [],
      splideOptions,
      isAdmin: true,
      showModal: false,
      toolsOpen: false, // 👈 agregado
      form: { file: null, title: '', text: '', published: true },
      previewUrl: '',
      submitting: false,
      errorMsg: '',
      loadingSlides: true,
      showList: false,
    }
  },

  async mounted() {
    // Escuchamos cambios en tiempo real (solo publicados para la vista pública)
    try {
      this.unsubSlides = listenSlides(slides => {
        // listenSlides devuelve ya solo los publicados cuando includeUnpublished=false
        this.slides = slides
        this.loadingSlides = false
      }, { includeUnpublished: false })
    } catch (e) {
      console.error('Error escuchando slides', e)
      this.loadingSlides = false
    }
  },
  beforeUnmount() {
    if (this.unsubSlides) this.unsubSlides()
  },

  computed: {
    slidesFiltrados() {
      // Muestra solo publicados; si el doc no tiene flag, asume true
      return (this.slides || []).filter(s => s.published !== false)
    }
  },
  methods: {
    handleAdminAction(event) {
      if (event === 'add') this.openModal()
      if (event === 'view') this.openList()
    },
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    // onSlideCreated removed: usamos listener en tiempo real para reflejar nuevos slides
    openList() {
    this.showList = true
  },
  closeList() {
    this.showList = false
  },
  onEditSlide(item) {
    console.log('Editar slide:', item)
    // Aquí luego puedes abrir ModalAdmin en modo edición con los datos
  }
  }

}
</script>