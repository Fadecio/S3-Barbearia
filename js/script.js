// ============================================================================
// S3 Barbearia — script único da landing page
// Tudo aqui: número de WhatsApp, mensagens prontas, montagem dos links,
// animação de reveal ao rolar e ano do rodapé.
// Escrito de forma simples e defensiva: se uma parte falhar, as outras
// continuam funcionando (o link do WhatsApp é o mais importante da página).
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  function paraLista(nodeList) {
    return Array.prototype.slice.call(nodeList || []);
  }

  // --- 1. Links de WhatsApp ---------------------------------------------
  try {
    const WHATSAPP_NUMERO = "5588921695445"; // número real da S3 Barbearia

    // Mensagens prontas, na voz do cliente. Pra trocar o texto que abre no
    // WhatsApp, edite só o texto aqui dentro.
    const MENSAGENS = {
      hero: "Oi! Vim pelo site da S3 Barbearia e queria marcar um horário. Quais horários vocês têm disponíveis?",
      corte:
        "Oi! Vim pelo site da S3 Barbearia e queria saber sobre o corte de cabelo. Qual o valor e quais horários têm?",
      barba:
        "Oi! Vim pelo site da S3 Barbearia e queria saber sobre a barba. Qual o valor e quais horários têm?",
      botox:
        "Oi! Vim pelo site da S3 Barbearia e queria saber sobre o botox capilar. Qual o valor e quais horários têm?",
      manicure:
        "Oi! Vim pelo site da S3 Barbearia e queria saber sobre a manicure. Qual o valor e quais horários têm?",
    };

    const linksWhatsApp = paraLista(document.querySelectorAll(".js-wa"));
    for (let i = 0; i < linksWhatsApp.length; i++) {
      const link = linksWhatsApp[i];
      const chave = link.getAttribute("data-wa-msg") || "hero";
      const texto = MENSAGENS[chave] || MENSAGENS.hero;
      const url =
        "https://wa.me/" +
        WHATSAPP_NUMERO +
        "?text=" +
        encodeURIComponent(texto);
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    }
  } catch (erro) {
    console.error("Falha ao montar links de WhatsApp:", erro);
  }

  // --- 2. Ano atual no rodapé ---------------------------------------------
  try {
    const anoEls = paraLista(document.querySelectorAll(".js-year"));
    const anoAtual = new Date().getFullYear();
    for (let j = 0; j < anoEls.length; j++) {
      anoEls[j].textContent = anoAtual;
    }
  } catch (erro2) {
    console.error("Falha ao definir o ano do rodapé:", erro2);
  }

  // --- 3. Reveal suave ao rolar --------------------------------------------
  // A classe .js na tag <html> já foi ligada no <head>. Se algo aqui falhar,
  // o CSS de fallback (sem a classe is-visible) ainda mantém o conteúdo
  // visível, então o pior cenário é sem animação, nunca conteúdo sumido.
  try {
    const elementosReveal = paraLista(document.querySelectorAll(".reveal"));
    if (window.IntersectionObserver && elementosReveal.length) {
      const observer = new IntersectionObserver(
        function (entradas) {
          for (let k = 0; k < entradas.length; k++) {
            const entrada = entradas[k];
            if (entrada.isIntersecting) {
              entrada.target.classList.add("is-visible");
              observer.unobserve(entrada.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );

      for (let m = 0; m < elementosReveal.length; m++) {
        observer.observe(elementosReveal[m]);
      }
    } else {
      for (let n = 0; n < elementosReveal.length; n++) {
        elementosReveal[n].classList.add("is-visible");
      }
    }
  } catch (erro3) {
    console.error("Falha no reveal ao rolar:", erro3);
    const todos = paraLista(document.querySelectorAll(".reveal"));
    for (let p = 0; p < todos.length; p++) {
      todos[p].classList.add("is-visible");
    }
  }

  // --- 4. Carrossel de fotos do hero --------------------------------------
  try {
    const carrossel = document.querySelector("[data-carousel]");
    if (carrossel) {
      const trilha = carrossel.querySelector(".carousel-track");
      const slides = paraLista(carrossel.querySelectorAll(".carousel-slide"));
      const pontos = paraLista(carrossel.querySelectorAll(".carousel-dot"));
      const btnAnterior = carrossel.querySelector(".carousel-prev");
      const btnProximo = carrossel.querySelector(".carousel-next");
      const passoAngulo = 360 / slides.length;
      let posicaoAtual = 0;
      let indiceAtual = 0;
      let temporizador = null;

      // Gira o anel 3D pra trazer a foto "indice" pra frente do usuário.
      function irPara(indice) {
        posicaoAtual = indice;
        indiceAtual =
          ((posicaoAtual % slides.length) + slides.length) % slides.length;
        if (trilha) {
          trilha.style.transform =
            "rotateY(" + -posicaoAtual * passoAngulo + "deg)";
        }
        for (let i = 0; i < slides.length; i++) {
          slides[i].classList.toggle("is-active", i === indiceAtual);
        }
        for (let j = 0; j < pontos.length; j++) {
          pontos[j].classList.toggle("is-active", j === indiceAtual);
          pontos[j].setAttribute(
            "aria-selected",
            j === indiceAtual ? "true" : "false",
          );
        }
      }

      function iniciarAutoplay() {
        pararAutoplay();
        temporizador = window.setInterval(function () {
          posicaoAtual += 1;
          irPara(posicaoAtual);
        }, 5000);
      }

      function pararAutoplay() {
        if (temporizador) {
          window.clearInterval(temporizador);
          temporizador = null;
        }
      }

      if (btnProximo) {
        btnProximo.addEventListener("click", function () {
          posicaoAtual += 1;
          irPara(posicaoAtual);
          iniciarAutoplay();
        });
      }
      if (btnAnterior) {
        btnAnterior.addEventListener("click", function () {
          posicaoAtual -= 1;
          irPara(posicaoAtual);
          iniciarAutoplay();
        });
      }
      for (let k = 0; k < pontos.length; k++) {
        pontos[k].addEventListener("click", function () {
          irPara(k);
          iniciarAutoplay();
        });
      }
      for (let s = 0; s < slides.length; s++) {
        slides[s].addEventListener("click", function () {
          irPara(s);
          iniciarAutoplay();
        });
      }

      carrossel.addEventListener("mouseenter", pararAutoplay);
      carrossel.addEventListener("mouseleave", iniciarAutoplay);
      carrossel.addEventListener("focusin", pararAutoplay);
      carrossel.addEventListener("focusout", iniciarAutoplay);

      irPara(0);
      if (slides.length > 1) {
        iniciarAutoplay();
      }
    }
  } catch (erroCarrossel) {
    console.error("Falha no carrossel do hero:", erroCarrossel);
  }

  // --- 5. Esconder a barra fixa de WhatsApp perto do rodapé (mobile) -----
  try {
    const barraFixa = document.querySelector(".mobile-cta");
    const rodape = document.querySelector(".site-footer");
    if (barraFixa && rodape && window.IntersectionObserver) {
      const observerRodape = new IntersectionObserver(
        function (entradas2) {
          for (let q = 0; q < entradas2.length; q++) {
            barraFixa.style.transform = entradas2[q].isIntersecting
              ? "translateY(120%)"
              : "translateY(0)";
          }
        },
        { threshold: 0.01 },
      );
      observerRodape.observe(rodape);
    }
  } catch (erro4) {
    console.error("Falha ao controlar a barra fixa mobile:", erro4);
  }
});
