<template>
  <transition name="bubble">
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" style="padding-top: 6rem;"
    >
      <!-- Contenedor principal -->
      <div
        class="relative w-full max-w-3xl mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/60 p-6 animate-bubbleIn max-h-[80vh] overflow-y-auto"
      >
        <!-- Botón cerrar -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-[#A2642C] hover:text-[#E87C2A] transition text-2xl cursor-pointer"
        >
          ×
        </button>

        <!-- Título -->
        <h2 class="text-2xl font-bold text-[#E87C2A] text-center mb-6">
          Cargar nuevo slide
        </h2>

        <!-- Formulario -->
        <form class="grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="confirmBeforeSave">
          <!-- Imagen -->
<div
  class="md:col-span-2 border-2 border-dashed border-[#E3B991] rounded-xl flex items-center justify-center bg-white/80 hover:bg-[#FFF0DA]/60 transition relative overflow-hidden"
>
  <label
    v-if="!previewUrl"
    for="fileInput"
    class="flex flex-col items-center justify-center cursor-pointer space-y-2 text-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="mt-2 h-8 w-8 text-[#E87C2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3" />
    </svg>
    <span class="text-sm font-medium text-[#A2642C]">Haz clic o arrastra una imagen aquí</span>
    <span class="text-xs text-[#5C3B1E]/70">Formatos: JPG, PNG, WEBP</span>
    <input id="fileInput" type="file" accept="image/*" @change="onFile" class="hidden" required />
  </label>

  <div v-else class="relative w-full h-full">
    <img
      :src="previewUrl"
      alt="Vista previa"
      class="absolute inset-0 w-full h-full object-cover rounded-lg"
    />
    <button
      type="button"
      @click="removeImage"
      class="absolute cursor-pointer top-2 right-2 bg-[#E87C2A] text-white text-xs px-2 py-1 rounded-md hover:bg-[#D66E20] transition"
    >
      Cambiar
    </button>
  </div>
</div>


          <!-- Título -->
          <div class="bg-white border border-[#E3B991]/80 rounded-xl p-4 flex flex-col justify-center">
            <label class="block text-sm font-semibold text-[#A2642C] mb-1">Título</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Escribe aquí..."
              class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40"
            />
          </div>

          <!-- Descripción -->
          <div class="bg-white border border-[#E3B991]/80 rounded-xl p-4 flex flex-col justify-center">
            <label class="block text-sm font-semibold text-[#A2642C] mb-1">Descripción</label>
            <input
              v-model="form.text"
              type="text"
              placeholder="Escribe aquí..."
              class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40"
            />
          </div>

          <!-- Publicado -->
          <div
            class="md:col-span-2 bg-white border border-[#E3B991]/80 rounded-xl p-4 flex justify-between items-center"
          >
            <label class="text-sm font-semibold text-[#A2642C]">Estado</label>
            <div class="flex items-center gap-3">
              <span
                class="text-xs font-semibold px-2 py-1 rounded-full"
                :class="form.published ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ form.published ? 'Publicado' : 'No publicado' }}
              </span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.published" class="sr-only peer" />
                <div
                  class="w-10 h-5 bg-[#E3B991]/60 rounded-full peer peer-checked:bg-[#E87C2A] transition"
                ></div>
                <div
                  class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"
                ></div>
              </label>
            </div>
          </div>

          <!-- Botones -->
          <div class="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="$emit('close')"
              class="cursor-pointer px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="cursor-pointer px-5 py-2 rounded-lg bg-[#E87C2A] text-white font-medium hover:bg-[#D66E20] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="!submitting">Guardar</span>
              <span v-else class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Guardando...
              </span>
            </button>
          </div>

          <p v-if="errorMsg" class="text-sm text-red-600 text-center md:col-span-2">
            {{ errorMsg }}
          </p>
        </form>
      </div>

      <!-- Modal de confirmación -->
      <transition name="fade">
        <div
          v-if="showConfirm"
          class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[10000]"
        >
          <div class="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <h3 class="text-lg font-semibold text-[#E87C2A] mb-3">Confirmar registro</h3>
            <p class="text-sm text-[#3B2C20] mb-4">
              ¿Deseas guardar el slide <strong>{{ form.title }}</strong>?
            </p>
            <div class="flex justify-center gap-3">
              <button
                @click="showConfirm = false"
                class="px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition"
              >
                Cancelar
              </button>
              <button
                @click="submit"
                class="px-5 py-2 rounded-lg bg-[#E87C2A] text-white hover:bg-[#D66E20] transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Modal de éxito -->
      <transition name="fade">
        <div
          v-if="showSuccess"
          class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[10000]"
        >
          <div class="bg-white rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl">
            <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
            <h4 class="text-lg font-semibold text-[#3B2C20]">Slide guardado correctamente</h4>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { createSlide } from '@/services/slidesService.js'

export default {
  name: 'ModalCreateSlide',
  emits: ['close', 'created'],
  data() {
    return {
      form: { file: null, title: '', text: '', published: true },
      previewUrl: '',
      submitting: false,
      errorMsg: '',
      showConfirm: false,
      showSuccess: false
    }
  },
  methods: {
    onFile(e) {
      const f = e.target.files?.[0]
      this.form.file = f || null
      this.previewUrl = f ? URL.createObjectURL(f) : ''
    },
    confirmBeforeSave() {
      this.showConfirm = true
    },
    removeImage() {
  this.previewUrl = ''
  this.form.file = null
},
    async submit() {
      if (this.submitting) return
      try {
        this.submitting = true
        this.showConfirm = false
        const res = await createSlide(this.form)
        this.showSuccess = true
        setTimeout(() => {
          this.showSuccess = false
          this.$emit('created', res)
          this.$emit('close')
        }, 1500)
      } catch (err) {
        this.errorMsg = err?.message || 'Error al guardar'
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
@keyframes bubbleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  60% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
.animate-bubbleIn {
  animation: bubbleIn 0.3s ease-out;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #e3b991;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #e87c2a;
}
</style>
