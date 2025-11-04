<template>
    <transition name="bubble">
        <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" style="padding-top: 5rem;">
            <div class="relative w-full max-w-3xl mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/60 p-6 animate-bubbleIn max-h-[85vh] overflow-y-auto">
                <button @click="$emit('close')" class="cursor-pointer absolute top-3 right-3 text-[#A2642C] hover:text-[#E87C2A] text-xl transition">×</button>

                <h2 class="text-xl font-bold text-[#E87C2A] text-center mb-6">
                    {{ title }}
                </h2>

                <form @submit.prevent="confirmBeforeSave" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <!-- Imagen / File (diseño similar a Modalcreate.vue) -->
                    <div class="md:col-span-2 border-2 border-dashed border-[#E3B991] rounded-xl flex items-center justify-center bg-white/80 hover:bg-[#FFF0DA]/60 transition relative overflow-hidden min-h-[12rem]">
                        <label v-if="!previewUrl" for="file" class="flex flex-col items-center justify-center cursor-pointer space-y-2 text-center w-full py-8">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-2 h-8 w-8 text-[#E87C2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3" />
                            </svg>
                            <span class="text-sm font-medium text-[#A2642C]">Haz clic o arrastra una imagen aquí</span>
                            <span class="text-xs text-[#5C3B1E]/70">Formatos: JPG, PNG, WEBP</span>
                            <input id="file" type="file" accept="image/*" class="hidden" @change="onFile" />
                        </label>

                        <div v-else class="relative w-full h-full">
                            <img :src="previewUrl" alt="Vista previa" class="absolute inset-0 w-full h-full object-cover rounded-lg" />
                            <button type="button" @click="removeImage" class="absolute cursor-pointer top-2 right-2 bg-[#E87C2A] text-white text-xs px-2 py-1 rounded-md hover:bg-[#D66E20] transition">Cambiar</button>
                        </div>
                    </div>

                    <!-- Dynamic fields -->
                    <template v-for="field in activeSchema" :key="field.name">
                        <div v-if="field.type === 'text'" class="bg-white border border-[#E3B991]/80 rounded-xl p-4">
                            <label class="block text-sm font-semibold text-[#A2642C] mb-1">{{ field.label }}</label>
                            <input v-model="form[field.name]" :type="field.inputType || 'text'" :placeholder="field.placeholder || ''" :required="field.required" class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-2 py-1 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-sm" />
                        </div>

                        <div v-if="field.type === 'number'" class="bg-white border border-[#E3B991]/80 rounded-xl p-4">
                            <label class="block text-sm font-semibold text-[#A2642C] mb-1">{{ field.label }}</label>
                            <input v-model.number="form[field.name]" type="number" :min="field.min || 0" :required="field.required" class="w-full rounded-lg border border-[#E3B991]/60 bg-[#FFF9F3] px-2 py-1 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-sm" />
                        </div>

                        <div v-if="field.type === 'toggle'" class="bg-white border border-[#E3B991]/80 rounded-xl p-4 flex justify-between items-center">
                            <label class="text-sm font-semibold text-[#A2642C]">{{ field.label }}</label>
                            <div class="flex items-center gap-2 text-sm font-medium">
                                <span :class="!form[field.name] ? 'text-[#E87C2A]' : 'text-slate-500'" class="cursor-pointer" @click="form[field.name] = false">No</span>
                                <div class="w-10 h-5 bg-[#E3B991]/60 rounded-full relative cursor-pointer" @click="form[field.name] = !form[field.name]">
                                    <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" :class="form[field.name] ? 'translate-x-5' : ''"></div>
                                </div>
                                <span :class="form[field.name] ? 'text-[#E87C2A]' : 'text-slate-500'" class="cursor-pointer" @click="form[field.name] = true">Sí</span>
                            </div>
                        </div>
                    </template>

                    <!-- Botones -->
                    <div class="sm:col-span-2 flex justify-end gap-3 pt-2">
                        <button type="button" @click="$emit('close')" class="cursor-pointer px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition">Cancelar</button>
                        <button type="submit" :disabled="submitting" class="cursor-pointer px-5 py-2 rounded-lg bg-[#E87C2A] text-white font-medium hover:bg-[#D66E20] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <span v-if="!submitting">Guardar</span>
                            <span v-else class="flex items-center gap-2">Guardando...</span>
                        </button>
                    </div>
                    <p v-if="errorMsg" class="text-sm text-red-600 sm:col-span-2">{{ errorMsg }}</p>
                </form>
            </div>
        </div>
    </transition>
</template>

<script>
import { createSlide } from '@/services/slidesService.js'
import { createProduct } from '@/services/productsService.js'
import { createPatrocinador } from '@/services/proveedoresService.js'

export default {
    name: 'ModalCreate',
    props: { open: Boolean, type: { type: String, default: 'slide' }, category: String, initial: Object },
    emits: ['close', 'created', 'error'],
    data() {
        return {
            form: {},
            previewUrl: '',
            submitting: false,
            errorMsg: ''
        }
    },
    computed: {
        // schema por tipo
        schemas() {
            return {
                slide: [
                    { name: 'file', type: 'file', required: true },
                    { name: 'title', type: 'text', label: 'Título', required: true },
                    { name: 'text', type: 'text', label: 'Descripción' },
                    { name: 'published', type: 'toggle', label: 'Publicado', required: false }
                ],
                product: [
                    { name: 'file', type: 'file', required: true },
                    { name: 'titulo', type: 'text', label: 'Nombre', required: true },
                    { name: 'valor', type: 'number', label: 'Valor', required: true },
                    { name: 'empaquetado', type: 'toggle', label: 'Empaquetado' },
                    { name: 'kilo', type: 'toggle', label: 'Kilo' },
                    { name: 'disponible', type: 'toggle', label: 'Disponible' }
                ],
                proveedor: [
                    { name: 'file', type: 'file', required: true },
                    { name: 'nombre', type: 'text', label: 'Nombre', required: true },
                    { name: 'published', type: 'toggle', label: 'Publicado' }
                ]
            }
        },
        activeSchema() {
            return this.schemas[this.type] || this.schemas.slide
        },
        title() {
            if (this.type === 'slide') return 'Cargar nuevo slide'
            if (this.type === 'product') return `Registrar producto - ${this.category || ''}`
            if (this.type === 'proveedor' || this.type === 'proveedor') return 'Nuevo patrocinador'
            return 'Crear'
        },
        requiresFile() {
            const f = this.activeSchema.find(s => s.name === 'file')
            return !!f && f.required
        }
    },
    watch: {
        open: {
            immediate: true,
            handler(v) {
                if (v) this.resetForm()
            }
        }
    },
    methods: {
        resetForm() {
            // inicializar defaults
            this.form = {}
            for (const f of this.activeSchema) {
                if (f.type === 'toggle') this.form[f.name] = f.default ?? true
                else this.form[f.name] = this.initial?.[f.name] ?? ''
            }
            this.previewUrl = this.initial?.imageUrl || ''
            this.errorMsg = ''
        },
        onFile(e) {
            const f = e.target.files?.[0]
            this.form.file = f || null
            this.previewUrl = f ? URL.createObjectURL(f) : (this.initial?.imageUrl || '')
        },
        removeImage() {
            this.previewUrl = ''
            this.form.file = null
        },
        confirmBeforeSave() {
            this.submit()
        },
        async submit() {
            if (this.submitting) return
            this.submitting = true
            this.errorMsg = ''
            try {
                let res = null
                if (this.type === 'slide') {
                    const payload = { file: this.form.file, title: this.form.title, text: this.form.text, published: !!this.form.published }
                    res = await createSlide(payload)
                } else if (this.type === 'product') {
                    const payload = { ...this.form }
                    res = await createProduct(this.category || 'general', payload)
                } else if (this.type === 'proveedor') {
                    const payload = { file: this.form.file, nombre: this.form.nombre, published: !!this.form.published }
                    res = await createPatrocinador(payload)
                } else {
                    throw new Error('Tipo desconocido')
                }

                this.$emit('created', res)
                this.$emit('close')
            } catch (err) {
                this.errorMsg = err?.message || 'Error al guardar'
                this.$emit('error', err)
            } finally {
                this.submitting = false
            }
        }
    }
}
</script>

<style scoped>
.animate-bubbleIn {
    animation: bubbleIn 0.25s ease-out;
}

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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
