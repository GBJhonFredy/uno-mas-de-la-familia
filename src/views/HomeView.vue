<template>
  <section class="bg-white text-slate-800">
    <!-- HEADER -->
    <header class="relative overflow-hidden py-14 text-center fade-in">
      <div class="absolute inset-0 bg-gradient-to-r from-brand-100/70 via-brand-200/50 to-brand-100/70 pointer-events-none"></div>
      <h1 class="relative text-4xl font-extrabold tracking-tight text-brand-700 drop-shadow-sm">
        UNO MÁS DE LA FAMILIA
      </h1>
      <p class="relative mt-2 text-slate-700">Amor, bienestar y cuidado para tus mascotas</p>
      <div class="relative mt-6 flex justify-center gap-3">
        <a
          href="https://wa.me/573167567448"
          class="smart-btn bg-whatsapp text-white px-5 py-2 rounded-xl shadow-soft hover:scale-[1.02] active:scale-95 transition"
        >WhatsApp 316 756 7448</a>
        <a
          href="tel:573013319889"
          class="smart-btn bg-white text-brand-700 ring-1 ring-brand-200 px-5 py-2 rounded-xl hover:bg-brand-50 transition"
        >Llámanos 301 331 9889</a>
      </div>
    </header>

    <!-- SLIDER -->
    <div class="max-w-5xl mx-auto px-4 fade-in">
      <Splide :options="splideOptions" aria-label="Galería principal" class="rounded-2xl overflow-hidden shadow-xl">
        <SplideSlide v-for="(slide, i) in slides" :key="i">
          <div class="relative group">
            <img :src="slide.image" :alt="slide.title" class="w-full h-[420px] object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            <div class="absolute bottom-0 p-6 text-white">
              <h3 class="text-2xl font-semibold">{{ slide.title }}</h3>
              <p class="text-sm text-white/80">{{ slide.text }}</p>
            </div>
          </div>
        </SplideSlide>
      </Splide>
    </div>

    <!-- MENSAJE DE BIENVENIDA -->
    <section class="max-w-6xl mx-auto mt-14 px-6 text-center">
        <div class="relative overflow-hidden rounded-3xl p-10">
            <!-- blobs suaves, sin bordes -->
            <div class="pointer-events-none absolute -top-24 -left-10 h-56 w-72 bg-brand-200/30 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-20 -right-10 h-56 w-72 bg-brand-100/40 blur-3xl"></div>

            <h2 class="relative text-3xl font-bold text-brand-700 mb-4 reveal">
            Amor, cuidado y calidad para tu mascota
            </h2>
            <p class="relative text-slate-700 leading-relaxed max-w-3xl mx-auto reveal reveal-delay-2">
            En <span class="font-semibold text-brand-600">UNO MÁS DE LA FAMILIA</span> creemos que cada mascota merece lo mejor.
            Ofrecemos <span class="text-brand-600">alimentos nutritivos, accesorios, y productos de belleza y salud</span>
            diseñados para su bienestar y felicidad. Somos más que una tienda,
            <span class="font-semibold">somos parte de su historia y su cuidado diario.</span>
            </p>
        </div>
    </section>

    <!-- INFO -->
    <section class="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8 fade-in">
      <div class="card-hover rounded-2xl p-6 ring-1 ring-slate-200 bg-white shadow-soft">
        <h3 class="text-xl font-semibold text-brand-700 mb-3">Ubicación</h3>
        <p>Bello, Antioquia · Niquía</p>
        <p class="text-sm text-slate-600">Avenida 41A # 62 - 4</p>
      </div>

      <div class="card-hover rounded-2xl p-6 ring-1 ring-slate-200 bg-white shadow-soft">
        <h3 class="text-xl font-semibold text-brand-700 mb-3">Horarios</h3>
        <ul class="space-y-1 text-sm">
          <li>Lunes a Sábado: 8:30 AM – 9:00 PM</li>
          <li>Domingo: 9:00 AM – 5:00 PM</li>
        </ul>
      </div>

      <div class="card-hover rounded-2xl p-6 ring-1 ring-slate-200 bg-white shadow-soft">
        <h3 class="text-xl font-semibold text-brand-700 mb-3">Contáctanos</h3>
        <p class="text-sm">📞 316 756 7448 / 301 331 9889</p>
        <p class="text-sm">✉️ contacto@unomasdelafamilia.com</p>
      </div>
    </section>

    <!-- CATEGORÍAS -->
    <section class="bg-slate-50 py-16 fade-in">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h3 class="text-2xl font-semibold text-slate-900 mb-10">Nuestras categorías</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="cat in categories"
            :key="cat.name"
            class="bg-white shadow-soft rounded-2xl p-6 ring-1 ring-slate-200 hover:-translate-y-1 hover:shadow-lg transition card-hover"
          >
            <img :src="cat.icon" :alt="cat.name" class="w-16 h-16 mx-auto mb-4" />
            <h4 class="font-semibold text-brand-700">{{ cat.name }}</h4>
            <p class="text-sm text-slate-600 mt-1">{{ cat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROVEEDORES -->
    <section class="max-w-6xl mx-auto px-4 py-16 text-center fade-in">
      <h3 class="text-2xl font-semibold mb-10">Nuestros proveedores</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
        <img v-for="prov in proveedores" :key="prov" :src="prov" class="w-24 h-24 object-contain grayscale hover:grayscale-0 transition" />
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-white py-8 mt-12">
      <div class="max-w-6xl mx-auto px-4 text-center space-y-2">
        <p>© 2025 UNO MÁS DE LA FAMILIA</p>
        <p class="text-sm text-white/70">Bello, Antioquia · Niquía · Av. 41A # 62 - 4</p>
        <p class="text-sm text-white/70">Tel: 316 756 7448 · 301 331 9889</p>
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
