export function useScrollReveal(selector = '.reveal', threshold = 0.18) {
  const initScrollReveal = (root = document) => {
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { threshold }
    )
    root.querySelectorAll(selector).forEach(el => io.observe(el))
  }

  return { initScrollReveal }
}
