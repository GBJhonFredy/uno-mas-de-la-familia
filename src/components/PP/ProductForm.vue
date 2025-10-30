<!-- /src/components/PP/ProductForm.vue -->
<template>
  <transition name="slide-up">
    <div v-if="open" class="fixed inset-0 z-[9999] flex items-end justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="relative w-full max-w-3xl bg-[#FFF7EE] rounded-t-3xl shadow-2xl border-t-4 border-[#E87C2A] p-6 animate-slideUp z-10">
        <header class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-[#E87C2A] capitalize">Agregar producto - {{ category }}</h2>
          <button @click="$emit('close')" class="p-2 rounded-full hover:bg-[#FFEBD3] transition">
            <i class="fas fa-times text-[#A2642C]"></i>
          </button>
        </header>

        <form class="grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="submit">
          <!-- Imagen -->
          <div class="md:col-span-2 border-2 border-dashed border-[#E3B991] rounded-xl p-4 text-center bg-white/80 hover:bg-[#FFF0DA]/50 transition">
            <label for="file" class="cursor-pointer flex flex-col items-center space-y-2">
              <i class="fas fa-upload text-3xl text-[#E87C2A]"></i>
              <span class="text-sm text-[#A2642C]">Haz clic o arrastra una imagen aquí</span>
              <input id="file" type="file" accept="image/*" class="hidden" @change="onFile" required />
            </label>
            <div v-if="previewUrl" class="mt-3">
              <img :src="previewUrl" alt="preview" class="h-32 mx-auto rounded-lg border border-[#FFD8A8]/60 object-cover" />
            </div>
          </div>

          <!-- Título -->
          <div class="bg-white border border-[#E3B991]/80 rounded-xl p-4">
            <label class="block text-sm font-semibold text-[#A2642C] mb-1">Título</label>
            <input v-model="form.titulo" type="text" placeholder="Ej: Concentrado Premium" class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40" />
          </div>

          <!-- Valor -->
          <div class="bg-white border border-[#E3B991]/80 rounded-xl p-4">
            <label class="block text-sm font-semibold text-[#A2642C] mb-1">Valor</label>
            <input v-model="form.valor" type="number" min="0" placeholder="Ej: 25000" class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40" />
          </div>

          <!-- Switches -->
          <div class="md:col-span-2 flex justify-around mt-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.empaquetado" class="h-4 w-4 text-[#E87C2A]" />
              <span class="text-sm text-[#3B2C20]">Empaquetado</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.kilo" class="h-4 w-4 text-[#E87C2A]" />
              <span class="text-sm text-[#3B2C20]">Kilo</span>
            </label>
          </div>

          <!-- Botones -->
          <div class="md:col-span-2 flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition">Cancelar</button>
            <button type="submit" :disabled="submitting" class="px-5 py-2 rounded-lg bg-[#E87C2A] text-white font-medium hover:bg-[#D66E20] transition disabled:opacity-60">
              {{ submitting ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { createProduct } from '@/services/productsService.js'

export default {
  name: 'ProductForm',
  props: { open: Boolean, category: String },
  emits: ['close', 'created'],
  data() {
    return {
      form: { file: null, titulo: '', valor: '', empaquetado: false, kilo: false },
      previewUrl: '',
      submitting: false
    }
  },
  methods: {
    onFile(e) {
      const f = e.target.files?.[0]
      this.form.file = f || null
      this.previewUrl = f ? URL.createObjectURL(f) : ''
    },
    async submit() {
      this.submitting = true
      try {
        const res = await createProduct(this.category, this.form)
        this.$emit('created', res)
        this.$emit('close')
      } catch (err) {
        console.error(err)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slideUp { animation: slideUp 0.3s ease-out; }
</style>
