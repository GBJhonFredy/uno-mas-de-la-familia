<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <!-- Contenedor principal -->
      <div
        class="relative w-full max-w-3xl mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/70 p-6 animate-fadeIn max-h-[90vh] overflow-y-auto"
      >
        <!-- Botón cerrar -->
        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-[#A2642C] hover:text-[#E87C2A] text-xl transition"
        >
          ×
        </button>

        <!-- Header -->
        <h2 class="text-xl font-bold text-[#E87C2A] text-center mb-5">
          Editar {{ type === 'slide' ? 'Slide' : type }}
        </h2>

        <!-- Formulario de edición: varía según tipo -->
        <div class="w-full text-sm border border-[#FFE1B0] rounded-2xl overflow-hidden p-3">
          <div v-if="type === 'slide'">
            <!-- Mantener tabla original para slides -->
            <table class="w-full text-sm">
              <thead class="bg-[#FFF1E4] text-[#3B2C20] font-semibold">
                <tr>
                  <th class="p-3 text-left">Imagen</th>
                  <th class="p-3 text-left">Título</th>
                  <th class="p-3 text-left">Descripción</th>
                  <th class="p-3 text-center">Publicado</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-[#FFE1B0] hover:bg-[#FFF8F2] transition">
                  <td class="p-3">
                    <img :src="form.imageUrl" alt="preview" class="w-24 h-16 object-cover rounded-lg border border-[#FFD8A8]/60 shadow-sm" />
                  </td>
                  <td class="p-3">
                    <input v-model="form.title" type="text" class="w-full bg-white border border-[#E3B991]/60 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-[#3B2C20]" />
                  </td>
                  <td class="p-3">
                    <input v-model="form.text" type="text" class="w-full bg-white border border-[#E3B991]/60 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-[#3B2C20]" />
                  </td>
                  <td class="p-3 text-center">
                    <div class="flex justify-center items-center gap-2">
                      <span class="text-xs font-medium text-[#3B2C20]">{{ form.published ? 'Sí' : 'No' }}</span>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="form.published" class="sr-only peer" />
                        <div class="w-10 h-5 bg-[#E3B991]/60 rounded-full peer peer-checked:bg-[#E87C2A] transition-all"></div>
                        <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all peer-checked:translate-x-5"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else-if="type === 'product'" class="grid grid-cols-1 gap-3">
            <div class="flex items-center gap-4">
              <img :src="form.imageUrl" alt="preview" class="w-24 h-16 object-cover rounded-lg border border-[#FFD8A8]/60 shadow-sm" />
              <div class="flex-1">
                <div class="text-sm font-medium text-[#3B2C20]">{{ form.title || form.titulo || form.nombre || form.titulo }}</div>
                <div class="text-xs text-[#5C3B1E]">Ruta: <span class="font-mono text-xs">{{ item.path }}</span></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <label class="flex flex-col text-sm">
                <span class="text-xs text-[#3B2C20] mb-1">Valor</span>
                <input v-model.number="form.valor" type="number" class="w-full bg-white border border-[#E3B991]/60 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-[#3B2C20]" />
              </label>

              <label class="flex flex-col text-sm">
                <span class="text-xs text-[#3B2C20] mb-1">Disponible</span>
                <div class="flex items-center gap-2">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="form.disponible" class="sr-only peer" />
                    <div class="w-10 h-5 bg-[#E3B991]/60 rounded-full peer peer-checked:bg-[#E87C2A] transition-all"></div>
                    <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all peer-checked:translate-x-5"></div>
                  </label>
                  <span class="text-sm">{{ form.disponible ? 'Disponible' : 'Agotado' }}</span>
                </div>
              </label>
            </div>
          </div>

          <div v-else>
            <!-- Fallback: mostrar datos por defecto -->
            <pre class="text-xs">{{ form }}</pre>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 pt-5">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            :disabled="submitting"
            @click="confirmUpdate"
            class="px-5 py-2 rounded-lg bg-[#E87C2A] text-white font-medium hover:bg-[#D66E20] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span v-if="!submitting">Guardar cambios</span>
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

        <!-- Modal éxito -->
        <transition name="fade">
          <div
            v-if="showSuccess"
              class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10000"
          >
            <div class="bg-white rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl">
              <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
              <h4 class="text-lg font-semibold text-[#3B2C20]">Cambios guardados</h4>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import { updateSlide } from '@/services/slidesService.js'
import { updateProduct } from '@/services/productsService.js'

export default {
  name: 'ModalEdit',
  props: { open: Boolean, type: String, item: Object },
  emits: ['close', 'updated'],
  data() {
    return {
      form: {
        title: '',
        text: '',
        published: true,
        imageUrl: ''
      },
      submitting: false,
      showSuccess: false
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(v) {
        if (v) this.form = { ...v }
      }
    }
  },
  methods: {
    confirmUpdate() {
      this.submit()
    },
    async submit() {
      if (this.submitting) return
      try {
        this.submitting = true
        if (this.type === 'product') {
          // Only allow updating valor and disponible for products
          const payload = {
            valor: typeof this.form.valor !== 'undefined' ? this.form.valor : this.form.valor || 0,
            disponible: typeof this.form.disponible !== 'undefined' ? !!this.form.disponible : !!this.form.disponible
          }
          const updated = await updateProduct(this.item.path, payload)
          this.showSuccess = true
          setTimeout(() => {
            this.showSuccess = false
            this.$emit('updated', updated)
            this.$emit('close')
          }, 900)
        } else {
          await updateSlide(this.item.path, this.form)
          this.showSuccess = true
          setTimeout(() => {
            this.showSuccess = false
            this.$emit('updated', this.form)
            this.$emit('close')
          }, 1200)
        }
      } catch (err) {
        console.error('Error actualizando', err)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
