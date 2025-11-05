<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
    >
      <!-- Fondo -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-md"
        @click="close"
      ></div>

      <!-- Modal principal -->
      <section
        class="relative w-full max-w-sm mx-4 bg-[#FFF7EE] rounded-2xl shadow-2xl border border-[#FFD8A8]/70 p-6 z-50"
      >
        <!-- Header -->
        <header
          class="flex items-center justify-between mb-5 border-b border-[#FFE1B0] pb-2"
        >
          <h3 class="text-lg font-semibold text-[#A2642C]">
            Acceso administrativo
          </h3>
          <button
            type="button"
            class="cursor-pointer text-[#A2642C] hover:text-[#E87C2A] transition text-sm font-medium"
            @click="close"
          >
            Cerrar ✕
          </button>
        </header>

        <!-- Formulario -->
        <form class="space-y-4" @submit.prevent="submit">
          <p class="text-sm text-[#5C3B1E]/80 leading-snug">
            Ingresa tus credenciales para habilitar los controles
            administrativos.  
            La sesión se guarda solo mientras el navegador esté abierto.
          </p>

          <div>
            <label class="block text-xs font-semibold text-[#A2642C] mb-1"
              >Usuario</label
            >
            <input
              v-model="user"
              type="text"
              placeholder="Nombre de usuario"
              class="w-full rounded-lg border border-[#E3B991]/80 bg-[#FFF9F3] px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#A2642C] mb-1"
              >Contraseña</label
            >
            <input
              v-model="pass"
              type="password"
              placeholder="********"
              class="w-full rounded-lg border border-[#E3B991]/80 bg-[#FFF9F3] px-3 py-2 outline-none focus:ring-2 focus:ring-[#E87C2A]/40 text-sm"
              @keyup.enter.prevent="submit"
            />
          </div>

          <div v-if="error" class="text-sm text-red-500 font-medium text-center">
            {{ error }}
          </div>

          <div class="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              class="cursor-pointer px-4 py-2 rounded-lg border border-[#E3B991] text-[#A2642C] hover:bg-[#FFF0DA] transition font-medium"
              @click="close"
              :disabled="loading"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="cursor-pointer px-5 py-2 rounded-lg bg-[#E87C2A] text-white font-medium hover:bg-[#D66E20] transition flex items-center justify-center min-w-[100px]"
              :disabled="loading"
            >
              <span v-if="!loading">Entrar</span>
              <span v-else class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-30"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Cargando…
              </span>
            </button>
          </div>
        </form>
      </section>

      <!-- Modal éxito unificado -->
      <transition name="scale-in">
        <div
          v-if="success"
          class="fixed inset-0 flex items-center justify-center z-[100000] bg-black/40 backdrop-blur-sm"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl border border-[#FFD8A8]/60 p-8 text-center animate-pop"
          >
            <div
              class="mx-auto mb-4 w-16 h-16 rounded-full bg-[#E87C2A]/10 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-[#E87C2A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 class="text-lg font-semibold text-[#A2642C]">
              {{ successMessage.title }}
            </h4>
            <p class="text-sm text-[#5C3B1E]/80 mt-1">
              {{ successMessage.text }}
            </p>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoginModal',
  props: { open: { type: Boolean, default: false } },
  data() {
    return {
      user: '',
      pass: '',
      error: '',
      loading: false,
      success: false,
      successMessage: { title: '', text: '' },
      ADMIN_USER: import.meta.env.VITE_ADMIN_USER || '',
      ADMIN_PASS: import.meta.env.VITE_ADMIN_PASS || ''
    }
  },
  watch: {
    open(val) {
      document.body.style.overflow = val ? 'hidden' : ''
      if (!val) this.resetForm()
    }
  },
  methods: {
    resetForm() {
      this.user = ''
      this.pass = ''
      this.error = ''
      this.loading = false
      this.success = false
      this.successMessage = { title: '', text: '' }
    },
    close() {
      this.$emit('close')
      this.resetForm()
    },

    async submit() {
      this.error = ''
      if (!this.user || !this.pass) {
        this.error = 'Usuario y contraseña requeridos'
        return
      }

      this.loading = true
      await new Promise((r) => setTimeout(r, 800))

      if (this.user === this.ADMIN_USER && this.pass === this.ADMIN_PASS) {
        try {
          sessionStorage.setItem('umdf_logged', '1')
        } catch {}
        this.showSuccess('Acceso concedido', 'Bienvenido, acceso administrativo habilitado.')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('umdf:login'))
          this.$emit('logged')
          this.close()
        }, 1800)
      } else {
        this.error = 'Credenciales inválidas'
      }

      this.loading = false
    },

    showSuccess(title, text) {
      this.successMessage = { title, text }
      this.success = true
      setTimeout(() => (this.success = false), 1800)
    },

    showLogoutModal() {
      this.showSuccess(
        'Sesión finalizada',
        'Tu sesión administrativa se ha cerrado correctamente.'
      )
      sessionStorage.removeItem('umdf_logged')
      setTimeout(() => {
        this.$emit('logged-out')
        this.resetForm()
      }, 1800)
    }
  },
  mounted() {
    window.addEventListener('umdf:logout', this.showLogoutModal)
  },
  beforeUnmount() {
    document.body.style.overflow = ''
    window.removeEventListener('umdf:logout', this.showLogoutModal)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-in-enter-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.scale-in-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

@keyframes pop {
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
.animate-pop {
  animation: pop 0.35s ease;
}
</style>
