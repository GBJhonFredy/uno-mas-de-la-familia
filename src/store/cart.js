// Store global simple con Vue reactivity. Sin Pinia. Escalable.
// Exposición de API clara y predecible para componentes.

import { reactive, computed } from 'vue';

const state = reactive({
  isOpen: false,
  items: [] // { id, name, price, qty, image }
});

const count = computed(() => state.items.reduce((a, b) => a + b.qty, 0));
const total = computed(() => state.items.reduce((a, b) => a + b.qty * b.price, 0));

function toggle(open = !state.isOpen) { state.isOpen = open; }

function add(item) {
  const found = state.items.find(i => i.id === item.id);
  if (found) found.qty += 1;
  else state.items.push({ ...item, qty: 1 });
}

function remove(id) {
  const idx = state.items.findIndex(i => i.id === id);
  if (idx !== -1) state.items.splice(idx, 1);
}

function decrease(id) {
  const it = state.items.find(i => i.id === id);
  if (!it) return;
  it.qty -= 1;
  if (it.qty <= 0) remove(id);
}

export const cart = { state, count, total, toggle, add, remove, decrease };
