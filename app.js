// Пульсация всех фото при попадании в зону видимости
(function () {
  // CSS-анимация добавляется через класс .pulse-in
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-soft {
      0%   { transform: scale(1); }
      20%  { transform: scale(1.03); }
      40%  { transform: scale(1); }
      60%  { transform: scale(1.03); }
      80%  { transform: scale(1); }
      100% { transform: scale(1); }
    }
    .pulse-in {
      animation: pulse-soft 2.4s ease-out;
      will-change: transform;
    }
    /* Уважение к настройке «уменьшить анимации» */
    @media (prefers-reduced-motion: reduce) {
      .pulse-in { animation: none; }
    }
  `;
  document.head.appendChild(style);

  // Все <img> на странице
  const imgs = document.querySelectorAll('img');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Запускаем анимацию (перезапуск если уже была)
        img.classList.remove('pulse-in');
        // force reflow, чтобы анимация стартовала заново
        void img.offsetWidth;
        img.classList.add('pulse-in');

        // Отписываемся — анимация сработает один раз при первом появлении
        obs.unobserve(img);
      }
    });
  }, {
    threshold: 0.25,           // сработает когда 25% фото видно
    rootMargin: '0px 0px -10% 0px'
  });

  imgs.forEach(img => {
    // Ждём пока фото загрузится, иначе анимация может сработать до показа
    if (img.complete) {
      observer.observe(img);
    } else {
      img.addEventListener('load', () => observer.observe(img), { once: true });
    }
  });
})();
