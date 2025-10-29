<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative w-full max-w-lg mx-4 rounded-2xl bg-white p-6 shadow-xl">
      <h3 class="text-xl font-semibold text-slate-800">Nuevo patrocinador</h3>

      <form class="mt-4 space-y-4" @submit.prevent="submitPatrocinador">
        <div>
          <label class="block text-sm text-slate-700 mb-1">Logo</label>
          <input type="file" accept="image/*" @change="onFile" required class="cursor-pointer block w-full text-sm" />
          <p v-if="previewUrl" class="mt-3">
            <img :src="previewUrl" alt="preview" class="h-32 w-full object-contain rounded-md ring-1 ring-slate-200" />
          </p>
        </div>

        <div>
          <label class="block text-sm text-slate-700 mb-1">Nombre</label>
          <input v-model="form.nombre" type="text" class="w-full rounded-lg ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-brand-300" />
        </div>

        <label class="inline-flex items-center gap-2">
          <input v-model="form.published" type="checkbox" class="h-4 w-4" />
          <span class="text-sm text-slate-700">Publicado</span>
        </label>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-lg ring-1 ring-slate-200 cursor-pointer">Cancelar</button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60 cursor-pointer">
            {{ submitting ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>

        <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { createPatrocinador } from '@/services/proveedoresService.js'

export default {
  name: 'ModalPatrocinador',
  data() {
    return {
      form: { file: null, nombre: '', published: true },
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
    async submitPatrocinador() {
      try {
        this.submitting = true
        const { file, nombre, published } = this.form
        const res = await createPatrocinador({ file, nombre, published })
        this.$emit('created', res)
        this.$emit('close')
      } catch (err) {
        this.errorMsg = err?.message || 'Error al guardar'
        this.submitting = false
      }
    }
  }
}
</script>
