<template>
  <transition name="bubble">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style="padding-top: 5rem;"
    >
      <!-- Contenedor modal -->
      <div
        class="relative w-full max-w-3xl mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/60 p-6 animate-bubbleIn max-h-[85vh] overflow-y-auto"
      >
        <!-- Botón cerrar -->
        <button
          @click="$emit('close')"
          class="cursor-pointer absolute top-3 right-3 text-[#A2642C] hover:text-[#E87C2A] text-xl transition"
        >
          ×
        </button>

        <!-- Título -->
        <h2 class="text-xl font-bold text-[#E87C2A] text-center mb-6">
          Registrar producto - {{ category }}
        </h2>

        <!-- Formulario -->
        <form class="grid grid-cols-1 sm:grid-cols-2 gap-5" @submit.prevent="confirmBeforeSave">
          <!-- Imagen -->
          <div
            class="sm:col-span-2 flex items-center justify-between bg-white border border-[#E3B991]/80 rounded-xl p-4"
          >
            <div class="flex flex-col gap-2">
              <label for="file" class="cursor-pointer flex items-center gap-2">
                <div
                  class="px-4 py-2 rounded-lg bg-[#E87C2A] text-white text-sm font-medium hover:bg-[#D66E20] transition"
                >
                  Cargar imagen
                </div>
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFile"
                  required
                />
              </label>
              <span class="text-xs text-[#5C3B1E]/70">Formatos: JPG, PNG, WEBP</span>
            </div>

            <div
              v-if="previewUrl"
              class="w-24 h-24 border border-[#FFD8A8]/70 rounded-lg overflow-hidden"
            >
              <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Nombre -->
          <div class="bg-white border border-[#E3B991]/80 rounded-xl p-4">
            <label class="block text-sm font-semibold text-[#A2642C] mb-1">Nombre del Articulo</label>
            <input
              v-model="form.titulo"
              type="text"
              maxlength="30"
              placeholder="Alimentos, Belleza, Salud, Accesorios"
              required
              class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-2 py-1 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-sm"
            />
          </div>

          <!-- Valor -->
          <div class="bg-white border border-[#E3B991]/80 rounded-xl p-4">
            <label class="block text-sm font-semibold text-[#A2642C] mb-1">Valor del Articulo</label>
            <input
              v-model="form.valor"
              type="number"
              min="0"
              placeholder="0"
              required
              class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-2 py-1 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-sm"
            />
          </div>

          <!-- Tipo y Unidad SOLO si es alimentos -->
          <template v-if="isAlimentos">
            <!-- Tipo -->
            <div
              class="bg-white border border-[#E3B991]/80 rounded-xl p-4 flex justify-between items-center"
            >
              <label class="text-sm font-semibold text-[#A2642C]">Tipo</label>
              <div class="flex items-center gap-2 text-sm font-medium">
                <span
                  :class="!form.empaquetado ? 'text-[#E87C2A]' : 'text-slate-500'"
                  class="cursor-pointer"
                  @click="form.empaquetado = false"
                  >Granel</span
                >
                <div
                  class="w-10 h-5 bg-[#E3B991]/60 rounded-full relative cursor-pointer"
                  @click="form.empaquetado = !form.empaquetado"
                >
                  <div
                    class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                    :class="form.empaquetado ? 'translate-x-5' : ''"
                  ></div>
                </div>
                <span
                  :class="form.empaquetado ? 'text-[#E87C2A]' : 'text-slate-500'"
                  class="cursor-pointer"
                  @click="form.empaquetado = true"
                  >Empaquetado</span
                >
              </div>
            </div>

            <!-- Unidad -->
            <div
              class="bg-white border border-[#E3B991]/80 rounded-xl p-4 flex justify-between items-center"
            >
              <label class="text-sm font-semibold text-[#A2642C]">Unidad</label>
              <div class="flex items-center gap-2 text-sm font-medium">
                <span
                  :class="!form.kilo ? 'text-[#E87C2A]' : 'text-slate-500'"
                  class="cursor-pointer"
                  @click="form.kilo = false"
                  >Libra</span
                >
                <div
                  class="w-10 h-5 bg-[#E3B991]/60 rounded-full relative cursor-pointer"
                  @click="form.kilo = !form.kilo"
                >
                  <div
                    class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                    :class="form.kilo ? 'translate-x-5' : ''"
                  ></div>
                </div>
                <span
                  :class="form.kilo ? 'text-[#E87C2A]' : 'text-slate-500'"
                  class="cursor-pointer"
                  @click="form.kilo = true"
                  >Kilo</span
                >
              </div>
            </div>
          </template>

          <!-- Botones -->
          <div class="sm:col-span-2 flex justify-end gap-3 pt-2">
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
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Guardando...
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Confirmación -->
      <transition name="fade">
        <div
          v-if="showConfirm"
          class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[10000]"
        >
          <div class="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <h3 class="text-lg font-semibold text-[#E87C2A] mb-3">Confirmar registro</h3>
            <p class="text-sm text-[#3B2C20] mb-4">
              ¿Deseas guardar <strong>{{ form.titulo }}</strong> en la categoría <strong>{{ category }}</strong>?
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

      <!-- Éxito -->
      <transition name="fade">
        <div
          v-if="showSuccess"
          class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[10000]"
        >
          <div class="bg-white rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl">
            <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
            <h4 class="text-lg font-semibold text-[#3B2C20]">Producto guardado</h4>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { createProduct } from '@/services/productsService.js'

export default {
  name: 'BottomSheetProduct',
  props: { open: Boolean, category: String },
  emits: ['close', 'created'],
  data() {
    return {
      form: { file: null, titulo: '', valor: '', empaquetado: false, kilo: false },
      previewUrl: '',
      submitting: false,
      showConfirm: false,
      showSuccess: false
    }
  },
  computed: {
    isAlimentos() {
      const c = this.category?.toLowerCase()
      return c === 'alimentos'
    }
  },
  methods: {
    onFile(e) {
      const file = e.target.files?.[0]
      this.form.file = file || null
      this.previewUrl = file ? URL.createObjectURL(file) : ''
    },
    confirmBeforeSave() {
      this.showConfirm = true
    },
    async submit() {
      if (this.submitting) return
      try {
        this.submitting = true
        this.showConfirm = false
        const item = await createProduct(this.category, this.form)
        this.showSuccess = true
        setTimeout(() => {
          this.showSuccess = false
          this.$emit('created', item)
          this.$emit('close')
        }, 1500)
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
@keyframes bubbleIn {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-bubbleIn {
  animation: bubbleIn 0.25s ease-out;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
