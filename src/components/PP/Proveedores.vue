<template>
  <section class="max-w-6xl mx-auto px-4 py-16 text-center fade-in relative">
    <h3 class="text-2xl font-semibold mb-10">Nuestros proveedores</h3>

    <!-- 🔹 CONTENEDOR PRINCIPAL (slider + loader + vacío) -->
    <div data-aos="fade-up" class="relative rounded-2xl min-h-[300px] flex items-center justify-center overflow-hidden">

      <!-- 🔹 Botón admin dentro del área -->
      <div class="absolute top-4 right-4 z-50">
        <BtnAdmin
          :actions="[
            { label: 'Nuevo', title: 'Agregar Proveedor', icon: '/img/upload-svgrepo-com.svg', event: 'add' }
          ]"
          @action="handleAdminAction"
        />
      </div>

      <!-- 🔹 Loader mientras carga -->
      <div v-if="loading" class="flex flex-col items-center justify-center text-slate-500 animate-pulse py-10">
        <svg class="w-12 h-12 mb-3 text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582M20 20v-5h-.581M9 19H4v-5m16 5h-5m-6-6V9m0 0V4m0 5h5m-5 0H4" />
        </svg>
        <p class="text-sm">Cargando proveedores...</p>
      </div>

      <!-- 🔹 Mensaje si no hay proveedores -->
      <div v-else-if="!proveedores.length" role="status" aria-live="polite"
        class="w-full rounded-2xl ph-empty bg-[#fbebda] text-center p-8 max-w-full mx-auto z-10 relative">
        <div class="mb-6">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <i class="fas fa-box text-3xl text-gray-400"></i>
          </div>
        </div>
        <h2 class="text-3xl text-gray-700 font-bold mb-4 leading-tight">
          Por el momento no tenemos proveedores
        </h2>
        <p class="text-gray-600 text-lg mb-6 leading-relaxed">
          Estamos gestionando nuevas alianzas para ofrecerte los mejores productos.
        </p>
        <div class="flex items-center justify-center text-gray-500">
          <i class="fas fa-clock mr-2"></i>
          <span class="text-sm">Vuelve pronto para ver nuestras marcas asociadas</span>
        </div>
      </div>

      <!-- 🔹 Slider de proveedores -->
      <Splide
        v-else
        :options="splideOptions"
        aria-label="Carrusel de proveedores"
        class="w-full py-4"
      >
        <SplideSlide
          v-for="(prov, i) in proveedores"
          :key="i"
          class="flex items-center justify-center"
        >
          <img
            :src="prov.imageUrl"
            :alt="prov.nombre"
            class="w-28 h-28 object-contain grayscale hover:grayscale-0 transition"
          />
        </SplideSlide>
      </Splide>
    </div>

    <!-- 🔹 Modal crear proveedor -->
    <ModalCreateProveedor
      v-if="showModal"
      @close="closeModal"
      @created="onProveedorCreated"
    />
  </section>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { getproveedores } from '@/services/proveedoresService.js'
import BtnAdmin from '@/components/admin/BtnAdmin.vue'
import ModalCreateProveedor from '@/components/admin/ModalCreateProveedor.vue'

export default {
  name: 'Proveedores',
  components: { Splide, SplideSlide, BtnAdmin, ModalCreateProveedor },
  data() {
    return {
      proveedores: [],
      loading: true,
      showModal: false,
      splideOptions: {
        perPage: 5,
        gap: '1rem',
        autoplay: true,
        interval: 2500,
        type: 'loop',
        pagination: false,
        arrows: false,
        pauseOnHover: false,
        breakpoints: {
          1024: { perPage: 4 },
          768: { perPage: 3 },
          480: { perPage: 2 }
        }
      }
    }
  },
  async mounted() {
    try {
      this.proveedores = await getproveedores()
    } catch (e) {
      console.error('Error al cargar proveedores', e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    handleAdminAction(event) {
      if (event === 'add') this.openModal()
    },
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    onProveedorCreated(item) {
      this.proveedores.unshift(item)
    }
  }
}
</script>
