// Funciones para la página de Óptica Solmar

// Variables globales
let isScrolling = false;
let currentSection = "inicio";

// Inicialización cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", function () {
  initializeAnimations();
  initializeScrollEffects();
  initializeNavigationEffects();
  initializeBranchCards();
  setupSmoothScrolling();
});

// Función para desplazamiento suave a secciones
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = document.querySelector(".header-custom").offsetHeight;
    const elementPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
}

// Inicializar animaciones de entrada
function initializeAnimations() {
  // Configurar observer para animaciones al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Animar elementos hijos con delay
        const children = entry.target.querySelectorAll(
          ".feature-card, .space-card, .branch-card"
        );
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = "1";
            child.style.transform = "translateY(0)";
          }, index * 150);
        });
      }
    });
  }, observerOptions);

  // Observar secciones
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });

  // Preparar elementos para animación
  document
    .querySelectorAll(".feature-card, .space-card, .branch-card")
    .forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
}

// Efectos de scroll
function initializeScrollEffects() {
  let ticking = false;

  function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Parallax effect en hero section
    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
      heroSection.style.transform = `translateY(${rate}px)`;
    }

    // Cambiar estilo del header al hacer scroll
    const header = document.querySelector(".header-custom");
    if (scrolled > 100) {
      header.classList.add("scrolled");
      header.style.background = "rgba(255, 255, 255, 0.95)"; // Cambiar de verde a blanco
      header.style.backdropFilter = "blur(10px)";
    } else {
      header.classList.remove("scrolled");
      header.style.background = "#ffffff"; // Cambiar de verde a blanco
      header.style.backdropFilter = "none";
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
}

// Efectos de navegación
function initializeNavigationEffects() {
  const navLinks = document.querySelectorAll(".nav-link");

  // Detectar sección activa al hacer scroll
  window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.pageYOffset + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Actualizar navegación activa
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
            link.style.color = "var(--primary-lighter)";
          }
        });
      }
    });
  });

  // Agregar efecto hover mejorado
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
}

// Inicializar efectos en tarjetas de sucursales
function initializeBranchCards() {
  const branchCards = document.querySelectorAll(".branch-card");

  branchCards.forEach((card) => {
    // Efecto hover mejorado
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
      this.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.15)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.08)";
    });

    // Efecto de click con información adicional
    card.addEventListener("click", function () {
      const branchName = this.querySelector("h5").textContent;
      showBranchDetails(branchName, this);
    });
  });
}

// Mostrar detalles adicionales de sucursal
function showBranchDetails(branchName, cardElement) {
  // Crear modal dinámico con información adicional
  const modalHtml = `
        <div class="modal fade" id="branchModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: var(--primary-color); color: white;">
                        <h5 class="modal-title">
                            <i class="fas fa-map-marker-alt me-2"></i>${branchName}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${getBranchDetailContent(branchName)}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-custom" onclick="contactBranch('${branchName}')">
                            <i class="fas fa-phone me-2"></i>Contactar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Remover modal existente si existe
  const existingModal = document.getElementById("branchModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Agregar modal al DOM
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("branchModal"));
  modal.show();

  // Limpiar modal después de cerrarlo
  document
    .getElementById("branchModal")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });
}

// Contenido detallado por sucursal
function getBranchDetailContent(branchName) {
  const branchDetails = {
    "Sucursal Centro": {
      description:
        "Nuestra sucursal principal ubicada en el corazón de la ciudad, equipada con la más avanzada tecnología para exámenes visuales.",
      services: [
        "Exámenes de vista completos",
        "Laboratorio óptico propio",
        "Lentes de contacto especializados",
        "Terapia visual",
        "Consultas oftalmológicas",
      ],
      features: [
        "Estacionamiento gratuito",
        "Accesibilidad completa",
        "Sala de espera climatizada",
        "WiFi gratuito",
      ],
    },
    "Sucursal Norte": {
      description:
        "Ubicada en el moderno Shopping Norte, ofrecemos la mayor variedad de monturas y lentes de sol de la región.",
      services: [
        "Amplio showroom de monturas",
        "Lentes de sol premium",
        "Accesorios ópticos",
        "Reparaciones express",
        "Asesoramiento personalizado",
      ],
      features: [
        "Horario extendido",
        "Ubicación central",
        "Fácil acceso en transporte público",
        "Promociones especiales",
      ],
    },
    "Sucursal Sur": {
      description:
        "En el tranquilo Barrio Jardín, brindamos atención personalizada en un ambiente relajado y familiar.",
      services: [
        "Exámenes visuales",
        "Monturas exclusivas",
        "Atención pediátrica especializada",
        "Consultas domiciliarias",
        "Planes de financiación",
      ],
      features: [
        "Ambiente familiar",
        "Atención sin apuros",
        "Especialización en niños",
        "Jardín exterior",
      ],
    },
    "Sucursal Este": {
      description:
        "Próxima apertura en la zona de mayor crecimiento de la ciudad. Será nuestra sucursal más moderna y tecnológica.",
      services: [
        "Servicios completos (próximamente)",
        "Tecnología de realidad virtual",
        "Laboratorio express",
        "Consultorio de especialidades",
      ],
      features: [
        "Tecnología de vanguardia",
        "Diseño moderno",
        "Amplio espacio",
        "Apertura: Agosto 2025",
      ],
    },
  };

  const details = branchDetails[branchName];
  if (!details) return "<p>Información no disponible</p>";

  return `
        <div class="row">
            <div class="col-md-12">
                <p class="lead">${details.description}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary mb-3">
                    <i class="fas fa-cogs me-2"></i>Servicios Disponibles
                </h6>
                <ul class="list-unstyled">
                    ${details.services
                      .map(
                        (service) =>
                          `<li class="mb-2"><i class="fas fa-check text-success me-2"></i>${service}</li>`
                      )
                      .join("")}
                </ul>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary mb-3">
                    <i class="fas fa-star me-2"></i>Características Especiales
                </h6>
                <ul class="list-unstyled">
                    ${details.features
                      .map(
                        (feature) =>
                          `<li class="mb-2"><i class="fas fa-plus text-info me-2"></i>${feature}</li>`
                      )
                      .join("")}
                </ul>
            </div>
        </div>
    `;
}

// Función para contactar sucursal
function contactBranch(branchName) {
  const phones = {
    "Sucursal Centro": "(+54) 381 123-4567",
    "Sucursal Norte": "(+54) 381 789-0123",
    "Sucursal Sur": "(+54) 381 456-7890",
    "Sucursal Este": "Próximamente",
  };

  const phone = phones[branchName];
  if (phone && phone !== "Próximamente") {
    // Crear enlace de WhatsApp
    const whatsappMessage = encodeURIComponent(
      `Hola, me interesa obtener información sobre los servicios de ${branchName} - Óptica Solmar`
    );
    const whatsappNumber = phone.replace(/\D/g, ""); // Remover caracteres no numéricos
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank");
  } else {
    alert(
      "Esta sucursal abrirá próximamente. Manténgase atento a nuestras redes sociales para más información."
    );
  }
}

// Configurar desplazamiento suave mejorado
function setupSmoothScrolling() {
  // Mejorar el scroll suave para todos los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight =
          document.querySelector(".header-custom").offsetHeight;
        const elementPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });

        // Actualizar URL sin scroll
        history.pushState(null, null, this.getAttribute("href"));
      }
    });
  });
}

// Función para mostrar notificaciones
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    `;

  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.body.appendChild(notification);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Función para manejar errores
function handleError(error) {
  console.error("Error:", error);
  showNotification(
    "Ha ocurrido un error. Por favor, inténtelo nuevamente.",
    "danger"
  );
}

// Event listeners adicionales
window.addEventListener("resize", function () {
  // Reajustar elementos responsive
  const cards = document.querySelectorAll(
    ".feature-card, .space-card, .branch-card"
  );
  cards.forEach((card) => {
    card.style.transform = "none";
  });
});

// Lazy loading para imágenes
function initializeLazyLoading() {
  const images = document.querySelectorAll("img");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Inicializar lazy loading cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initializeLazyLoading);

// Función de utilidad para detectar dispositivo móvil
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// Ajustes específicos para móvil
if (isMobileDevice()) {
  document.addEventListener("DOMContentLoaded", function () {
    // Reducir efectos de hover en móviles
    const hoverElements = document.querySelectorAll(
      ".feature-card, .space-card, .branch-card"
    );
    hoverElements.forEach((element) => {
      element.style.transition = "transform 0.2s ease";
    });
  });
}
