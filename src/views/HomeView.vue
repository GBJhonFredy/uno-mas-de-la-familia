<template>
  <section class="bg-white text-slate-800">
    <!-- HEADER -->
    <header class="py-10 text-center fade-in">
      <h1 class="text-4xl font-bold text-brand-600 tracking-tight">
        UNO MÁS DE LA FAMILIA
      </h1>
      <p class="mt-2 text-slate-600">
        Amor, bienestar y cuidado para tus mascotas
      </p>
    </header>

    <!-- SLIDER -->
    <div class="max-w-5xl mx-auto px-4 fade-in">
      <Splide
        :options="splideOptions"
        aria-label="Galería principal"
        class="rounded-2xl overflow-hidden shadow-soft"
      >
        <SplideSlide v-for="(slide, i) in slides" :key="i">
          <div class="relative">
            <img
              :src="slide.image"
              :alt="slide.title"
              class="w-full h-[400px] object-cover"
            />
            <div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
              <h3 class="text-2xl font-semibold">{{ slide.title }}</h3>
              <p class="text-sm text-white/80">{{ slide.text }}</p>
            </div>
          </div>
        </SplideSlide>
      </Splide>
    </div>

    <!-- SECCIÓN INFORMACIÓN -->
    <section class="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-10 fade-in">
      <div>
        <h3 class="text-xl font-semibold text-brand-600 mb-3">Ubicación</h3>
        <p>Calle 12 #45-67, Centro, Ciudad Mascota</p>
        <p class="mt-1 text-sm text-slate-500">Frente al parque principal</p>
      </div>

      <div>
        <h3 class="text-xl font-semibold text-brand-600 mb-3">Horarios</h3>
        <ul class="space-y-1 text-sm">
          <li>Lunes a Viernes: 8:00 AM – 7:00 PM</li>
          <li>Sábados: 9:00 AM – 5:00 PM</li>
          <li>Domingos: Cerrado</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-semibold text-brand-600 mb-3">Contáctanos</h3>
        <p class="text-sm">📞 (+57) 300 456 7890</p>
        <p class="text-sm">✉️ contacto@unomasdelafamilia.com</p>
      </div>
    </section>

    <!-- CATEGORÍAS -->
    <section class="bg-slate-50 py-16 fade-in">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h3 class="text-2xl font-semibold text-slate-900 mb-10">
          Nuestras categorías
        </h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="cat in categories"
            :key="cat.name"
            class="bg-white shadow-soft rounded-xl p-6 hover:shadow-lg transition card-hover"
          >
            <img :src="cat.icon" :alt="cat.name" class="w-16 h-16 mx-auto mb-4" />
            <h4 class="font-semibold text-brand-600">{{ cat.name }}</h4>
            <p class="text-sm text-slate-600 mt-1">{{ cat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROVEEDORES -->
    <section class="max-w-6xl mx-auto px-4 py-16 text-center fade-in">
      <h3 class="text-2xl font-semibold mb-10">Nuestros proveedores</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
        <img
          v-for="prov in proveedores"
          :key="prov"
          :src="prov"
          class="w-24 h-24 object-contain grayscale hover:grayscale-0 transition"
        />
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-white py-8 mt-12">
      <div class="max-w-6xl mx-auto px-4 text-center space-y-2">
        <p>© 2025 UNO MÁS DE LA FAMILIA</p>
        <p class="text-sm text-white/70">Calle 12 #45-67, Ciudad Mascota</p>
        <p class="text-sm text-white/70">Tel: (+57) 300 456 7890</p>
      </div>
    </footer>
  </section>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { slides, categories, proveedores, splideOptions } from '../data/homeData.js'

export default {
  name: 'HomeView',
  components: { Splide, SplideSlide },
  data() {
    return { slides, categories, proveedores, splideOptions }
  }
}
</script>

