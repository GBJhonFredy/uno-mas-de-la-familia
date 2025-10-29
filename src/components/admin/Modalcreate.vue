<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center"
    style="padding-top: 8rem; padding-bottom: 2%;"> <!-- 🔹 compensación del header sticky (~64px) -->
    <!-- Fondo -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Contenedor principal -->
    <div
  class="relative w-full max-w-xl mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/60 p-6 animate-fadeIn overflow-y-auto max-h-[80vh]">

      
      <!-- Botón cerrar -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-[#A2642C] hover:text-[#E87C2A] transition-colors text-2xl leading-none">
        ×
      </button>

      <!-- Título -->
      <h2 class="text-2xl font-bold text-[#E87C2A] text-center mb-8">
        Cargar nuevo slide
      </h2>

      <!-- Formulario -->
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="submit">
        <!-- Archivo -->
        <div class="md:col-span-2 border-2 border-dashed border-[#E3B991] rounded-xl p-6 text-center bg-white/80 hover:bg-[#FFF0DA]/60 transition">
          <label
            for="fileInput"
            class="flex flex-col items-center justify-center cursor-pointer space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#E87C2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3" />
            </svg>
            <span class="text-sm font-medium text-[#A2642C]">Haz clic o arrastra una imagen aquí</span>
            <span class="text-xs text-[#5C3B1E]/70">Formatos: JPG, PNG, WEBP</span>
            <input id="fileInput" type="file" accept="image/*" @change="onFile" class="hidden" required />
          </label>

          <div v-if="previewUrl" class="mt-4">
            <img :src="previewUrl" alt="Vista previa"
              class="mx-auto rounded-lg shadow-md border border-[#FFD8A8]/70 h-40 object-cover" />
          </div>
        </div>

        <!-- Título -->
        <div>
          <label class="block text-sm font-semibold text-[#A2642C] mb-1">Título</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Escribe aquí..."
            class="w-full rounded-lg border border-[#E3B991] bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-semibold text-[#A2642C] mb-1">Descripción</label>
          <textarea
            v-model="form.text"
            rows="3"
            placeholder="Escribe aquí..."
            class="w-full rounded-lg border border-[#E3B991] bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40"
          ></textarea>
        </div>

        <!-- Publicado -->
        <div class="md:col-span-2 flex items-center gap-2 mt-2">
          <input v-model="form.published" type="checkbox" class="h-4 w-4 text-[#E87C2A] focus:ring-[#E87C2A]" />
          <span class="text-sm text-[#3B2C20]">Publicado</span>
        </div>

        <!-- Botones -->
        <div class="md:col-span-2 flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition">
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2 rounded-lg bg-[#E87C2A] text-white font-medium hover:bg-[#D66E20] transition disabled:opacity-60">
            {{ submitting ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>

        <p v-if="errorMsg" class="md:col-span-2 text-sm text-red-600 mt-2">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { createSlide } from '@/services/slidesService.js'

export default {
  name: 'ModalCreate',
  emits: ['close', 'created'],
  data() {
    return {
      form: { file: null, title: '', text: '', published: true },
      previewUrl: '',
      submitting: false,
      errorMsg: ''
    }
  },
  methods: {
    onFile(e) {
      const f = e.target.files?.[0]
      this.form.file = f || null
      this.previewUrl = f ? URL.createObjectURL(f) : ''
    },
    async submit() {
      try {
        this.submitting = true
        this.errorMsg = ''
        const res = await createSlide(this.form)
        this.$emit('created', {
          id: res.id,
          imageUrl: res.imageUrl,
          title: this.form.title,
          text: this.form.text,
          published: this.form.published
        })
        this.$emit('close')
      } catch (err) {
        this.errorMsg = err?.message || 'Error al guardar'
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
