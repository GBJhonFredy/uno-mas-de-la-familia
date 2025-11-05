<template>
  <section class="text-[#3B2C20]">
    <!-- HEADER -->
    <header id="inicio"  class="px-5 scroll-mt-32 relative overflow-hidden py-14 text-center fade-in">
      <div class="absolute inset-0 bg-gradient-to-r from-[#FFEBD3]/80 via-[#FFD8A8]/70 to-[#FFF0DA]/80 pointer-events-none"></div>
      <h1 class="font-pacifico relative text-4xl  tracking-tight text-[#E87C2A] drop-shadow-sm">
        Uno + de la Familia
      </h1>
      <p class="relative mt-2 text-[#5C3B1E]">
        Amor, bienestar y cuidado para tus mascotas
      </p>
      <div  class="relative mt-6 flex justify-center gap-3">
        <a data-aos="fade-right"
          href="https://wa.me/573167567448"
          class="smart-btn bg-whatsapp  items-center gap-1 text-white px-5 py-2 rounded-xl flex flex-col sm:flex-row shadow-lg hover:scale-[1.03] active:scale-95 transition">
          <span>WhatsApp</span>
          <span>316 756 7448</span>
        </a>
        <a data-aos="fade-left"
          href="tel:573013319889"
          class="smart-btn bg-white text-[#A2642C]  items-center gap-1 border border-[#E3B991] px-5 py-2 rounded-xl flex flex-col sm:flex-row  hover:bg-[#FFF1E4] transition">
          <span >Llámanos</span>
          <span class="text-sm">301 331 9889</span>
        </a>
      </div>
    </header>
    
    <!-- SLIDER -->
    <section class="mt-8 px-5">
      <Slider />
    </section>
    <!-- MENSAJE DE BIENVENIDA -->
    <section data-aos="fade-up" id="contacto" class="scroll-mt-32 max-w-6xl mx-auto mt-14 px-6 text-center">
      <div class="relative overflow-hidden rounded-3xl p-10 bg-white shadow-md ring-1 ring-[#F3D6B3]/70">
        <!-- blobs suaves -->
        <div class="pointer-events-none absolute -top-24 -left-10 h-56 w-72 bg-[#FFD8A8]/40 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-20 -right-10 h-56 w-72 bg-[#FFEBD3]/50 blur-3xl"></div>

       <h2 class="relative text-3xl font-bold text-brand-700 mb-4">
          Amor, cuidado y calidad para tu mascota
        </h2>
        <p class="relative text-slate-700 leading-relaxed max-w-3xl mx-auto">
          En <span class="font-semibold text-brand-600">UNO MÁS DE LA FAMILIA</span> creemos que cada mascota merece lo mejor.
          Ofrecemos <span class="text-brand-600">alimentos nutritivos, accesorios, y productos de belleza y salud</span>
          diseñados para su bienestar y felicidad. Somos más que una tienda,
          <span class="font-semibold">somos parte de su historia y su cuidado diario.</span>
        </p>
      </div>
    </section>

    <!-- INFO -->
    <section data-aos="fade-up" class="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8 fade-in">
      <div class="card-hover rounded-2xl p-6 ring-1 ring-[#F3D6B3] bg-white shadow-md hover:shadow-lg">
        <h3 class="text-xl font-semibold text-[#E87C2A] mb-3">Ubicación</h3>
        <p>Bello, Antioquia · Niquía</p>
        <p class="text-sm text-[#5C3B1E]">Avenida 41A # 62 - 4</p>
      </div>

      <div class="card-hover rounded-2xl p-6 ring-1 ring-[#F3D6B3] bg-white shadow-md hover:shadow-lg">
        <h3 class="text-xl font-semibold text-[#E87C2A] mb-3">Horarios</h3>
        <ul class="space-y-1 text-sm text-[#3B2C20]">
          <li>Lunes a Sábado: 8:30 AM – 9:00 PM</li>
          <li>Domingo: 9:00 AM – 5:00 PM</li>
        </ul>
      </div>

      <div class="card-hover rounded-2xl p-6 ring-1 ring-[#F3D6B3] bg-white shadow-md hover:shadow-lg">
        <h3 class="text-xl font-semibold text-[#E87C2A] mb-3">Contáctanos</h3>
        <p class="text-sm">📞 316 756 7448 / 301 331 9889</p>
        <p class="text-sm">✉️ contacto@unomasdelafamilia.com</p>
      </div>
    </section>


    <!-- CATEGORÍAS -->
<section id="productos" class="scroll-mt-38 bg-[#FFF0DA] py-16 fade-in">
  <div class="max-w-6xl mx-auto px-4 text-center">
    <h3 class="text-2xl font-semibold text-[#A2642C] mb-10">Nuestras categorías</h3>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="cat in categories"
        :key="cat.name"
        class="relative cursor-pointer bg-white shadow-md rounded-2xl p-6 ring-1 ring-[#F3D6B3] hover:-translate-y-1 hover:shadow-lg transition"
        @click="openCategory(cat.name)"
      >
        <!-- BtnAdmin sobre cada card (visible sólo si está logueado) -->
        <div v-if="isAdmin" class="absolute top-2 right-2 z-10" @click.stop>
          <BtnAdmin
            :actions="[
              { label: 'Agregar', title: 'Nuevo producto', icon: '/img/upload-svgrepo-com.svg', event: 'add' },
              { label: 'Ver', title: 'Ver productos', icon: '/img/list-check-box-svgrepo-com.svg', event: 'view' }
            ]"
            @action="onAction(cat.name, $event)"
          />
        </div>

        <img :src="cat.icon" :alt="cat.name" class="w-16 h-16 mx-auto mb-4" />
        <h4 class="font-semibold text-[#E87C2A]">{{ cat.name }}</h4>
        <p class="text-sm text-[#5C3B1E] mt-1">{{ cat.desc }}</p>
      </div>
    </div>
  </div>
   <ModalCreate
    v-if="showForm"
    :open="showForm"
    type="product"
    :category="currentCategory"
    @close="showForm = false"
    @created="showForm = false"
  />
  <ModalList :open="showList" type="product" :category="currentCategory" @close="showList = false" />
  <BottomSheet :open="bottomOpen" :items="bottomItems" :category="currentCategory" @close="bottomOpen = false" @added-many="onAddedMany" @added="onAddedSingle" />
</section>
<!-- Bottom-sheet creación -->
  



    <!-- PROVEEDORES -->
    <Proveedores />

    <!-- FOOTER -->
    <footer class="bg-[#3B2C20] text-[#FFF7EE] py-8 mt-12">
      <div class="max-w-6xl mx-auto px-4 text-center space-y-2">
        <p>© 2025 UNO MÁS DE LA FAMILIA</p>
        <p class="text-sm text-[#F3D6B3]">Bello, Antioquia · Niquía · Av. 41A # 62 - 4</p>
        <p class="text-sm text-[#F3D6B3]">Tel: 316 756 7448 · 301 331 9889</p>
      </div>
      <div class="h-[4px] bg-gradient-to-r from-[#E87C2A] via-[#FFD8A8] to-[#C76B2D] mt-6"></div>
    </footer>
  </section>
 
</template>

<script>
import Slider from '@/components/PP/Slide.vue'
import Proveedores from '@/components/PP/Proveedores.vue'
import ModalCreate from '@/components/admin/ModalCreate.vue'
import ModalList from '@/components/admin/ModalList.vue'
import BottomSheet from '@/components/PP/BottomSheet.vue'
import { getProducts } from '@/services/productsService.js'
import BtnAdmin from '@/components/admin/BtnAdmin.vue'
import { categories } from '../data/homeData.js'



export default {
  name: 'HomeView',
  components: { Slider, Proveedores, ModalCreate, BtnAdmin, ModalList, BottomSheet },
  data() {
    return {  categories,
      showForm: false,
      currentCategory: '',
      showList: false,
      // bottom sheet state
      bottomOpen: false,
      bottomItems: [],
      // admin state
      isAdmin: Boolean(sessionStorage.getItem('umdf_logged'))
    }
  },
  mounted() {
    this._onLogin = () => { this.isAdmin = true }
    this._onLogout = () => { this.isAdmin = false }
    window.addEventListener('umdf:login', this._onLogin)
    window.addEventListener('umdf:logout', this._onLogout)
  },
  beforeUnmount() {
    window.removeEventListener('umdf:login', this._onLogin)
    window.removeEventListener('umdf:logout', this._onLogout)
  },
  methods: {
    onAction(category, action) {
      this.currentCategory = category.toLowerCase()
      if (action === 'add') this.showForm = true
      if (action === 'view') this.showList = true
    }
    ,
    async openCategory(cat) {
      // abrir panel inferior con productos de la categoría seleccionada
      try {
        this.currentCategory = (cat || '').toLowerCase()
        this.bottomItems = []
        this.bottomOpen = true
        this.bottomItems = await getProducts(this.currentCategory || 'general')
      } catch (err) {
        console.error('Error cargando productos para bottom sheet', err)
        this.bottomItems = []
      }
    },
    onAddedMany(list) {
      // acción tras agregar varios items (opcional: mostrar toast)
      console.info('Items agregados al pedido:', list)
    },
    onAddedSingle(item) {
      console.info('Item agregado al pedido:', item)
    }
  },
}
</script>

