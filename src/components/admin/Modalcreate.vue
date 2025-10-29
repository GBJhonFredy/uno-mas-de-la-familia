<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative w-full max-w-lg mx-4 rounded-2xl bg-white p-6 shadow-xl">
      <h3 class="text-xl font-semibold text-slate-800">Nuevo slide</h3>

      <form class="mt-4 space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-sm text-slate-700 mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            @change="onFile"
            required
            class="cursor-pointer block w-full text-sm"
          />
          <p v-if="previewUrl" class="mt-3">
            <img
              :src="previewUrl"
              alt="preview"
              class="h-32 w-full object-cover rounded-md ring-1 ring-slate-200"
            />
          </p>
        </div>

        <div>
          <label class="block text-sm text-slate-700 mb-1">Título</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-lg ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-brand-300"
          />
        </div>

        <div>
          <label class="block text-sm text-slate-700 mb-1">Descripción</label>
          <textarea
            v-model="form.text"
            rows="3"
            class="w-full rounded-lg ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-brand-300"
          ></textarea>
        </div>

        <label class="inline-flex items-center gap-2">
          <input v-model="form.published" type="checkbox" class="h-4 w-4" />
          <span class="text-sm text-slate-700">Publicado</span>
        </label>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="cursor-pointer px-4 py-2 rounded-lg ring-1 ring-slate-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="cursor-pointer px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
          >
            {{ submitting ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>

        <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
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
