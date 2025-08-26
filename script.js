// Animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")

      // Add stagger effect for multiple elements
      const siblings = entry.target.parentElement?.children
      if (siblings) {
        Array.from(siblings).forEach((sibling, index) => {
          if (sibling.classList.contains("fade-in-up")) {
            setTimeout(() => {
              sibling.classList.add("visible")
            }, index * 100)
          }
        })
      }
    }
  })
}, observerOptions)

// Observe all animation elements
document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in, .fade-in-up").forEach((el) => {
  observer.observe(el)
})

// Counter animation
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2500
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    // Format numbers with commas for large numbers
    const formattedNumber = Math.floor(current).toLocaleString()
    element.textContent = formattedNumber
  }, 16)
}

// Start counter animation when visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target)
      counterObserver.unobserve(entry.target)
    }
  })
})

document.querySelectorAll(".counter").forEach((counter) => {
  counterObserver.observe(counter)
})

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
const mobileMenuClose = document.getElementById("mobile-menu-close")

function toggleMobileMenu() {
  mobileMenu.classList.toggle("active")
  document.body.classList.toggle("overflow-hidden")

  // Animate menu items
  const menuItems = mobileMenu.querySelectorAll(".mobile-nav-item")
  menuItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.transform = mobileMenu.classList.contains("active") ? "translateX(0)" : "translateX(100px)"
    }, index * 50)
  })
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", toggleMobileMenu)
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", toggleMobileMenu)
}

// Close mobile menu when clicking on links
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
    document.body.classList.remove("overflow-hidden")
  })
})

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (mobileMenu && mobileMenu.classList.contains("active")) {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove("active")
      document.body.classList.remove("overflow-hidden")
    }
  }
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerOffset = 100
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Navbar background change on scroll
let lastScrollTop = 0
const navbar = document.querySelector("nav")

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // Add background on scroll
  if (scrollTop > 50) {
    navbar.classList.add("bg-white/95", "backdrop-blur-lg", "shadow-2xl")
    navbar.style.borderBottom = "1px solid rgba(226, 232, 240, 0.8)"
  } else {
    navbar.classList.remove("bg-white/95", "backdrop-blur-lg", "shadow-2xl")
    navbar.style.borderBottom = "1px solid #e2e8f0"
  }

  // Hide/show navbar on scroll
  if (scrollTop > lastScrollTop && scrollTop > 300) {
    navbar.style.transform = "translateY(-100%)"
    navbar.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  } else {
    navbar.style.transform = "translateY(0)"
    navbar.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  }

  lastScrollTop = scrollTop
})

// Parallax effect for hero sections
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".floating-shapes")

  parallaxElements.forEach((element) => {
    const speed = 0.2
    element.style.transform = `translateY(${scrolled * speed}px)`
  })

  // Parallax for floating cards
  const floatingCards = document.querySelectorAll(".floating-card")
  floatingCards.forEach((card, index) => {
    const speed = 0.1 + index * 0.05
    card.style.transform = `translateY(${scrolled * speed}px)`
  })
})

// Loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Animate elements on page load
  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)

  // Add stagger delays to grid items
  document.querySelectorAll(".grid > *").forEach((item, index) => {
    if (item.classList.contains("fade-in-up")) {
      item.style.transitionDelay = `${index * 0.1}s`
    }
  })

  // Initialize any other components
  console.log("United Maritime Association website loaded successfully")
})

// Enhanced form handling
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const submitBtn = form.querySelector("button[type='submit']")
    const originalText = submitBtn.textContent
    const formData = new FormData(form)

    // Enhanced loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...'
    submitBtn.disabled = true
    submitBtn.classList.add("opacity-75")

    // Validate form fields
    const requiredFields = form.querySelectorAll("input[required], textarea[required], select[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      const value = field.value.trim()
      const fieldContainer = field.closest(".form-group") || field.parentElement

      // Remove existing error states
      field.classList.remove("border-red-500", "border-green-500")
      const existingError = fieldContainer.querySelector(".error-message")
      if (existingError) existingError.remove()

      if (!value) {
        isValid = false
        field.classList.add("border-red-500")

        // Add error message
        const errorMsg = document.createElement("p")
        errorMsg.className = "error-message text-red-500 text-sm mt-1"
        errorMsg.textContent = `${field.name || "This field"} is required`
        fieldContainer.appendChild(errorMsg)
      } else {
        field.classList.add("border-green-500")
      }

      // Email validation
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          isValid = false
          field.classList.remove("border-green-500")
          field.classList.add("border-red-500")

          const errorMsg = document.createElement("p")
          errorMsg.className = "error-message text-red-500 text-sm mt-1"
          errorMsg.textContent = "Please enter a valid email address"
          fieldContainer.appendChild(errorMsg)
        }
      }
    })

    if (isValid) {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message
      showNotification("Message sent successfully! We'll get back to you soon.", "success")

      // Reset form
      form.reset()
      requiredFields.forEach((field) => {
        field.classList.remove("border-red-500", "border-green-500")
      })
    } else {
      showNotification("Please fill in all required fields correctly.", "error")
    }

    // Reset button state
    submitBtn.textContent = originalText
    submitBtn.disabled = false
    submitBtn.classList.remove("opacity-75")
  })
})

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `fixed top-6 right-6 z-50 p-6 rounded-2xl shadow-2xl transform translate-x-full transition-all duration-500 max-w-md ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
  }`

  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"} mr-3 text-xl"></i>
      <span class="font-semibold">${message}</span>
      <button class="ml-4 text-white hover:text-gray-200 transition-colors" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentElement) {
        document.body.removeChild(notification)
      }
    }, 500)
  }, 5000)
}

// Scroll indicator for hero section
const scrollIndicator = document.querySelector(".scroll-indicator")
if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  })
}

// Enhanced hover effects
document.querySelectorAll(".service-card, .feature-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-15px) scale(1.02)"

    // Add glow effect
    this.style.boxShadow = "0 25px 70px rgba(59, 130, 246, 0.15)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)"
    this.style.boxShadow = ""
  })
})

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove("loading")
      img.classList.add("loaded")
      imageObserver.unobserve(img)
    }
  })
})

document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img)
})

// Preloader
document.addEventListener("DOMContentLoaded", () => {
  // Add fade-in class to body after DOM is loaded
  setTimeout(() => {
    document.body.style.opacity = "1"
    document.body.classList.add("loaded")
  }, 100)

  // Add stagger delays to grid items
  document.querySelectorAll(".grid > *").forEach((item, index) => {
    if (item.classList.contains("fade-in-up")) {
      item.style.transitionDelay = `${index * 0.1}s`
    }
  })

  // Initialize any other components
  console.log("United Maritime Association website loaded successfully")
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
    toggleMobileMenu()
  }

  // Navigate with arrow keys in dropdowns
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    const activeDropdown = document.querySelector(".dropdown:hover")
    if (activeDropdown) {
      e.preventDefault()
      const items = activeDropdown.querySelectorAll(".dropdown-item")
      const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement)

      if (e.key === "ArrowDown") {
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[nextIndex].focus()
      } else {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[prevIndex].focus()
      }
    }
  }
})

// Touch gestures for mobile
let touchStartX = 0
let touchEndX = 0
let touchStartY = 0
let touchEndY = 0

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX
  touchStartY = e.changedTouches[0].screenY
})

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX
  touchEndY = e.changedTouches[0].screenY
  handleSwipe()
})

function handleSwipe() {
  const swipeThreshold = 100
  const diffX = touchStartX - touchEndX
  const diffY = touchStartY - touchEndY

  // Only handle horizontal swipes
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
    if (diffX > 0 && !mobileMenu.classList.contains("active")) {
      // Swipe left - open menu
      toggleMobileMenu()
    } else if (diffX < 0 && mobileMenu.classList.contains("active")) {
      // Swipe right - close menu
      toggleMobileMenu()
    }
  }
}

// Performance optimization
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
  // Additional scroll-based animations can be added here
  updateScrollProgress()
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)

// Scroll progress indicator
function updateScrollProgress() {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100

  // Update any scroll progress indicators
  const progressBars = document.querySelectorAll(".scroll-progress")
  progressBars.forEach((bar) => {
    bar.style.width = `${scrollPercent}%`
  })
}

// Enhanced error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  // Could send error reports to analytics service
})

// Service worker registration for PWA capabilities
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
