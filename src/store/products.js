// Estados: "activo", "inactivo", "agotado", "disponible"
// "activo" + "disponible" => vendible
// "inactivo" => oculto del listing
// "agotado" => visible, bloquea "Agregar"

export const products = [
  {
    id: "p1",
    name: "Cama Ortopédica M",
    price: 149900,
    status: "disponible",
    image: "/src/assets/hero.jpg",
    description: "Soporte premium para tu peludo."
  },
  {
    id: "p2",
    name: "Collar Reflectivo",
    price: 29900,
    status: "agotado",
    image: "/src/assets/hero.jpg",
    description: "Seguridad nocturna."
  },
  {
    id: "p3",
    name: "Juguete Masticable",
    price: 19900,
    status: "activo",
    image: "/src/assets/hero.jpg",
    description: "Durable y divertido."
  },
  {
    id: "p4",
    name: "Champú Hipoalergénico",
    price: 25900,
    status: "inactivo",
    image: "/src/assets/hero.jpg",
    description: "Suave con la piel."
  }
];
