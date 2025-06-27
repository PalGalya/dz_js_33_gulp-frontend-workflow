document.addEventListener('DOMContentLoaded', () => {
  const features = document.querySelectorAll('.feature')

  features.forEach((feature) => {
    feature.style.opacity = '0'
    feature.style.transform = 'translateY(20px)'
  })

  setTimeout(() => {
    features.forEach((feature, index) => {
      setTimeout(() => {
        feature.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        feature.style.opacity = '1'
        feature.style.transform = 'translateY(0)'
      }, index * 200)
    })
  }, 500)
})
