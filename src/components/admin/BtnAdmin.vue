<template>
  <div class="relative inline-block">
    <!-- BOTÓN PRINCIPAL -->
    <button
      type="button"
      class="admin-btn"
      :title="title"
      :aria-label="title"
      @click="toggle"
    >
      <img
        v-if="!open"
        :src="iconOpen"
        alt="Abrir"
        class="w-5 h-5"
      />
      <img
        v-else
        :src="iconClose"
        alt="Cerrar"
        class="w-5 h-5"
      />
    </button>

    <!-- SUBMENÚ -->
    <transition name="fade">
      <div
        v-if="open"
        class="admin-submenu"
        role="menu"
        aria-label="Opciones administrativas"
      >
        <button
          v-for="(item, i) in actions"
          :key="i"
          type="button"
          class="submenu-btn"
          :title="item.label"
          @click="handleAction(item)"
        >
          <img
            v-if="item.icon"
            :src="item.icon"
            alt=""
            class="w-5 h-5 opacity-70"
          />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BtnAdmin',
  props: {
    title: { type: String, default: 'Administrar' },
    iconOpen: { type: String, default: '/img/light-config-svgrepo-com.svg' },
    iconClose: { type: String, default: '/img/cancel-close-svgrepo-com.svg' },
    actions: {
      type: Array,
      default: () => [] // [{ label:'Nuevo', icon:'/img/upload-svgrepo-com.svg', event:'create' }]
    }
  },
  emits: ['action'],
  data() {
    return { open: false }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    handleAction(item) {
      this.$emit('action', item.event)
      this.open = false
    }
  }
}
</script>

