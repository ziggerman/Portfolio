document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. Custom Styled Select Menus
  // ==========================================
  function createCustomSelects() {
    const selects = document.querySelectorAll('select.form-input-select');
    
    selects.forEach(select => {
      // Avoid duplicate wrappers if initialized twice
      if (select.nextElementSibling && select.nextElementSibling.classList.contains('custom-select-wrapper')) {
        return;
      }
      
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';
      
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      const selectedOption = select.options[select.selectedIndex];
      trigger.textContent = selectedOption ? selectedOption.textContent : '';
      
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'custom-select-options';
      
      Array.from(select.options).forEach(opt => {
        const customOpt = document.createElement('div');
        customOpt.className = 'custom-select-option';
        customOpt.textContent = opt.textContent;
        customOpt.dataset.value = opt.value;
        
        if (opt.selected) {
          customOpt.classList.add('selected');
        }
        
        customOpt.addEventListener('click', (e) => {
          e.stopPropagation();
          
          select.value = opt.value;
          
          const event = new Event('change', { bubbles: true });
          select.dispatchEvent(event);
          
          trigger.textContent = opt.textContent;
          
          optionsContainer.querySelectorAll('.custom-select-option').forEach(item => {
            item.classList.remove('selected');
          });
          customOpt.classList.add('selected');
          
          trigger.classList.remove('open');
          optionsContainer.classList.remove('open');
        });
        
        optionsContainer.appendChild(customOpt);
      });
      
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        document.querySelectorAll('.custom-select-trigger').forEach(otherTrigger => {
          if (otherTrigger !== trigger) {
            otherTrigger.classList.remove('open');
            otherTrigger.nextElementSibling.classList.remove('open');
          }
        });
        
        trigger.classList.toggle('open');
        optionsContainer.classList.toggle('open');
      });
      
      wrapper.appendChild(trigger);
      wrapper.appendChild(optionsContainer);
      select.parentNode.insertBefore(wrapper, select.nextSibling);
    });
    
    document.addEventListener('click', () => {
      document.querySelectorAll('.custom-select-trigger').forEach(trigger => {
        trigger.classList.remove('open');
        trigger.nextElementSibling.classList.remove('open');
      });
    });
  }
  
  createCustomSelects();

  // ==========================================
  // 1. Navigation & Scroll Effects
  // ==========================================
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Throttle helper to limit scroll handler frequency
  function throttle(fn, limit) {
    let inThrottle = false;
    return function(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => { inThrottle = false; }, limit);
      }
    };
  }

  const handleScroll = throttle(() => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNav();
  }, 100);

  window.addEventListener('scroll', handleScroll);

  function highlightNav() {
    let scrollPos = window.scrollY + 120; // Offset for sticky header
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  mobileMenuToggle.addEventListener('click', () => {
    const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !expanded);
    navMenu.style.display = expanded ? 'none' : 'flex';
    if (!expanded) {
      // Style overlay for mobile navigation dynamically
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '80px';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = 'rgba(5, 6, 10, 0.95)';
      navMenu.style.padding = '2rem';
      navMenu.style.borderBottom = '1px solid var(--border-color)';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navMenu.style.display = 'none';
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navMenu.removeAttribute('style');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ==========================================
  // 2. Portfolio Filtering & Modals
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filtering Logic
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          // Little animation trigger
          card.style.animation = 'messageReveal 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modals Open/Close Logic
  const detailButtons = document.querySelectorAll('.btn-card-details');
  const modals = document.querySelectorAll('.modal-overlay');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      }
    });
  });

  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    const modalBody = modal.querySelector('.modal-body');
    
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = ''; // Unlock scrolling
      // Restore focus to the trigger button
      const openTrigger = document.querySelector('.btn-card-details[data-modal="' + modal.id + '"]');
      if (openTrigger) openTrigger.focus();
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal when clicking any anchor link inside it
    modal.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', closeModal);
    });

    // Escape key to close modal
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Focus trap — keep focus inside modal
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !modalBody) return;
      const focusableEls = modalBody.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableEls.length === 0) return;
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  });

  // Global Escape to close any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('open')) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  });


  // ==========================================
  // 3. Interactive Telegram Bots Simulator
  // ==========================================
  
  // Bot Response Databases
  const botReplies = {
    crypto: {
      "📊 Огляд ринку": {
        text: "📊 <b>Огляд ринку на ф'ючерсах Binance (9:41)</b>\n\n🟢 <b>BTCUSDT</b>: $67,420 (+2.4%)\n🟢 <b>ETHUSDT</b>: $3,850 (+3.1%)\n🟢 <b>SOLUSDT</b>: $165 (+5.8%)\n\n🔔 <i>Виявлено аномалію:</i> Сплеск об'ємів SOL (+240% за 5хв). ML оцінка впевненості сигналу: <b>92%</b>."
      },
      "🔔 мої Сповіщення": {
        text: "🔔 <b>Ваші активні сповіщення:</b>\n\n1. SOLUSDT — Volume > 200% (15m)\n2. BTCUSDT — RSI < 30 (1h)\n\nОберіть опцію для керування:",
        inline: [
          { text: "➕ Створити нове", callback: "crypto_create" },
          { text: "🗑️ Видалити алерти", callback: "crypto_delete" }
        ]
      },
      "⚙️ Налаштування": {
        text: "⚙️ <b>Налаштування сповіщень Screener:</b>\n\nМова: <i>Українська</i>\nЧастота алертів: <i>миттєво</i>\nПоріг об'єму: <i>150%</i>\n\nОберіть параметр для зміни:",
        inline: [
          { text: "🌐 Мова / Language", callback: "crypto_lang" },
          { text: "⏱️ Частота сповіщень", callback: "crypto_freq" },
          { text: "🧠 Smart Screener", callback: "crypto_screener" }
        ]
      },
      "❓ Довідка": {
        text: "📈 <b>Довідка по командах бота:</b>\n\n• Бот відстежує цінові аномалії та RSI розходження.\n• Використовує ATR для розрахунку ризику та плеча.\n• Для тонкого налаштування відкрийте WebApp у меню."
      },
      // Inlines Callback Replies
      "crypto_create": {
        text: "✏️ <b>Налаштування нового сповіщення:</b>\n\nВведіть тікер монети (наприклад, <code>ETHUSDT</code> або <code>SOLUSDT</code>) або відкрийте WebApp для зручного конфігурування."
      },
      "crypto_delete": {
        text: "🗑️ <b>Видалення сповіщень:</b>\n\nВсі алерти успішно очищено з бази даних."
      },
      "crypto_lang": {
        text: "🌐 <b>Виберіть мову / Select Language:</b>\n\n• Українська (Встановлено)\n• English\n• Português"
      },
      "crypto_freq": {
        text: "⏱️ <b>Встановіть частоту сповіщень:</b>\n\n• Миттєво (Встановлено)\n• 5 хвилин\n• 15 хвилин\n• Щоденний дайджест"
      },
      "crypto_screener": {
        text: "🧠 <b>Smart Screener (Чутливість ШІ):</b>\n\n• Висока (Багато аномалій)\n• Середня (Збалансовано - Встановлено)\n• Низька (Тільки великі тренди)"
      }
    },
    tetiana: {
      "🎓 Змінити режим": {
        text: "🎓 <b>Оберіть базу знань для RAG-пошуку:</b>\n\nПоточний режим: <b>NOM</b>",
        inline: [
          { text: "🟡 NOM — Номінальне", callback: "t_mode_nom" },
          { text: "🟣 GALLUP — Сильні сторони", callback: "t_mode_gallup" },
          { text: "🔵 DNA — ДНК команди", callback: "t_mode_dna" }
        ]
      },
      "📊 Статус бази": {
        text: "📊 <b>Стан векторної бази знань (Pinecone/FAISS):</b>\n\n• 🟡 <code>NOM</code> — 1,240 фрагментів\n• 🟣 <code>GALLUP</code> — 850 фрагментів\n• 🔵 <code>DNA</code> — 420 фрагментів\n• 🔴 <code>COURSE4</code> — 2,100 фрагментів\n\n<i>Всі бази готові до роботи.</i>"
      },
      "📚 Додати знання": {
        text: "📚 <b>Завантаження матеріалів у Tetiana AI:</b>\n\nОберіть формат файлу для індексування:",
        inline: [
          { text: "📄 Документ (PDF/DOCX)", callback: "t_up_doc" },
          { text: "🎥 YouTube-відео", callback: "t_up_video" },
          { text: "✍️ Текст (вручну)", callback: "t_up_text" }
        ]
      },
      "💡 Інструкція": {
        text: "📖 <b>Tetiana AI - Інструкція розробника:</b>\n\n1. Надішліть файл або лінк на YouTube відео.\n2. Бот завантажить його та розпізнає текст Whisper/OCR.\n3. Задавайте будь-які запитання безпосередньо у чат."
      },
      // Inlines Callback Replies
      "t_mode_nom": {
        text: "✅ Режим змінено на <b>NOM — Номінальне управління</b>. Задавайте питання по матеріалах NOM."
      },
      "t_mode_gallup": {
        text: "✅ Режим змінено на <b>GALLUP — Сильні сторони</b>. Задавайте питання по тестах Gallup."
      },
      "t_mode_dna": {
        text: "✅ Режим змінено на <b>DNA — ДНК команди</b>. Задавайте питання по філософії компанії."
      },
      "t_up_doc": {
        text: "📥 Надішліть документ (PDF, DOCX, PPTX або TXT). Бот розпізнає його і збереже векторні ембеддінги."
      },
      "t_up_video": {
        text: "🔗 Вставте посилання на YouTube відео або надішліть mp4 файл. Бот запустить Whisper для транскрипції звуку."
      },
      "t_up_text": {
        text: "✍️ Просто введіть або вставте текст у поле повідомлення і надішліть його сюди."
      }
    },
    threads: {
      "🔍 Пошук лідів": {
        text: "🔍 <b>Пошук лідів у Meta Threads:</b>\n\nВведіть ключову фразу для пошуку (наприклад, <i>Шукаю Таргетолога</i>). Бот знайде пости, ШІ оцінить теплоту, і якщо лід гарячий/теплий — автоматично напише коментар та сповістить вас у Telegram.",
        inline: [
          { text: "▶️ Запустити пошук ЗАРАЗ", callback: "th_run" },
          { text: "⏹️ Зупинити пошук", callback: "th_stop" }
        ]
      },
      "📊 Моя статистика": {
        text: "📊 <b>Статистика Threads Hunter:</b>\n\n• Знайдено постів: <b>340</b>\n• 🔥 Гарячих лідів: <b>28</b>\n• ⚡ Теплих лідів: <b>76</b>\n• ❄️ Холодних / Відсіяно: <b>236</b>\n• 🤖 Авто-коментарів надіслано: <b>104</b>\n• 📨 Сповіщень в Telegram: <b>104</b>"
      },
      "🎛️ Налаштування": {
        text: "🎛️ <b>Налаштування Threads Hunter:</b>\n\nПоріг теплоти: <i>Теплий</i>\nАвто-коментар: <i>Увімкнено</i>\nСповіщення в TG: <i>Увімкнено</i>\n\nНалаштування:",
        inline: [
          { text: "🎯 Поріг теплоти ШІ", callback: "th_warmth" },
          { text: "💬 Авто-коментар", callback: "th_comment" },
          { text: "📨 Сповіщення TG", callback: "th_notify" },
          { text: "⏱️ Планувальник", callback: "th_sched" }
        ]
      },
      "👤 Мій профіль": {
        text: "👤 <b>Стан сесії Threads:</b>\n\nКористувач: <code>threads_hunter_b2b</code>\nТокен Meta API: <b>Активний</b>\nТермін дії: 45 днів.\nКлючові фрази: <i>Шукаю Таргетолога, Потрібен дизайнер, Шукаю SMM</i>",
        inline: [
          { text: "🔑 Авторизувати наново", callback: "th_login" }
        ]
      },
      // Inlines Callback Replies
      "th_run": {
        text: "📡 <b>Пошук запущено за фразою 'Шукаю Таргетолога'!</b>\n\nЗнайдено 7 постів. ШІ аналізує:\n✅ 2 гарячих ліда — коментар надіслано ✅, сповіщення в Telegram відправлено 📨\n✅ 1 теплий лід — коментар надіслано ✅\n❌ 4 холодних — пропущено"
      },
      "th_stop": {
        text: "🛑 <b>Пошук примусово зупинено.</b> Всі знайдені гарячі/теплі ліди вже опрацьовані."
      },
      "th_warmth": {
        text: "🎯 <b>Поріг оцінки теплоти ліда (ШІ):</b>\n\n• 🟢 Гарячий + Теплий (Рекомендовано - Встановлено)\n• 🔥 Тільки гарячий\n• ❄️ Всі (з ручною перевіркою)"
      },
      "th_comment": {
        text: "💬 <b>Авто-коментар при знаходженні теплого/гарячого ліда:</b>\n\n• ✅ Увімкнено (Бот пише ШІ-коментар під постом — Встановлено)\n• ❌ Вимкнено (тільки сповіщення)"
      },
      "th_notify": {
        text: "📨 <b>Сповіщення в Telegram:</b>\n\n• ✅ Увімкнено — миттєве сповіщення про теплих/гарячих лідів (Встановлено)\n• ❌ Вимкнено"
      },
      "th_sched": {
        text: "⏱️ <b>Планувальник запусків скрейпера:</b>\n\n• Кожні 3 години (Встановлено)\n• Кожні 6 годин\n• Кожні 12 годин\n• Вручну"
      },
      "th_login": {
        text: "🔑 <b>Вхід у Threads API:</b>\n\nНадсилаю лінк для авторизації Meta OAuth. Будь ласка, увійдіть у кабінет."
      }
    },
    carousel: {
      "🎨 HTML Карусель": {
        text: "🎨 <b>HTML Карусель для Instagram (4:5):</b>\n\nОберіть дію:",
        inline: [
          { text: "🚀 Створити карусель", callback: "c_run" },
          { text: "⚙️ Налаштування параметрів", callback: "c_settings" }
        ]
      },
      "🤖 AI Копірайтер": {
        text: "🤖 <b>AI Копірайтер готовий до написання тексту:</b>\n\nВведіть тему каруселі (наприклад: <i>як написати сильний промпт</i>):"
      },
      "💡 Генератор ідей": {
        text: "💡 <b>AI Генератор ідей (хуків) для постів:</b>\n\n• <i>Ідея 1:</i> 5 помилок при виборі CRM, які коштують $1000.\n• <i>Ідея 2:</i> Як ШІ-агенти заміняють саппорт на 70%?"
      },
      "🖼 Мої набори": {
        text: "📂 <b>Ваша бібліотека фонів та шаблонів:</b>\n\n• 📁 <code>coffee_presets</code> (12 зображень)\n• 📁 <code>tech_modern</code> (8 зображень)\n• 📁 <code>abstract_gradients</code> (6)\n\nОберіть дію:",
        inline: [
          { text: "➕ Створити набір", callback: "c_new_set" }
        ]
      },
      // Inlines Callback Replies
      "c_run": {
        text: "🚀 <b>Рендеринг каруселі запущено!</b>\n\nPlaywright генерує 7 слайдів у HD. HSL-кольори згенеровано успішно. Готовий архів з зображеннями надішлю за 30 сек."
      },
      "c_settings": {
        text: "⚙️ <b>Параметри HTML генератора:</b>\n\nБренд: <code>Stotskyi</code>\nШрифт: <i>Modern (Plus Jakarta Sans)</i>\nТон: <i>professional</i>\nМова: <i>uk</i>\nЗатемнення: <i>Blur</i>"
      },
      "c_new_set": {
        text: "📝 <b>Введіть назву нового набору зображень:</b>"
      }
    },
    instalead: {
      "🔍 Пошук нових лідів": {
        text: "🔍 <b>Пошук лідів через Google Search:</b>\n\nВведіть ключовий запит пошуку (наприклад, <i>салон краси київ</i>) або відкрийте налаштування фільтрів."
      },
      "📂 Збережені ліди": {
        text: "📂 <b>База лідів (leads.db):</b>\n\n• 🔥 Гарячих: <b>32</b>\n• ⚡ Теплих: <b>89</b>\n\nВиберіть дію:",
        inline: [
          { text: "📥 Експорт в CSV", callback: "il_export" }
        ]
      },
      "⚙️ Налаштування фільтрів": {
        text: "⚙️ <b>Параметри лідогенератора:</b>\n\n• Неактивність профілю: <i>60 днів</i>\n• Мінімальні підписники: <i>200</i>\n\nОберіть параметр:",
        inline: [
          { text: "📅 Макс. неактивність", callback: "il_days" },
          { text: "👥 Мін. підписники", callback: "il_subs" }
        ]
      },
      "📊 Статистика бази": {
        text: "📊 <b>Статистика скрейпінгу InstaLeadScout:</b>\n\n• Всього перевірено профілів: <b>1,450</b>\n• Збережено B2B контактів: <b>121</b>\n• Робочі сесії: <b>Cookie активовані</b>"
      },
      // Inlines Callback Replies
      "il_export": {
        text: "📥 <b>Експорт бази даних:</b>\n\nНадсилаю сформований CSV файл: <code>instagram_leads_export.csv</code> (121 лід). Файл готовий до імпорту в CRM."
      },
      "il_days": {
        text: "📅 <b>Введіть кількість днів неактивності (10–365):</b>\n\nБот відсіє профілі, які закинули ведення сторінки."
      },
      "il_subs": {
        text: "👥 <b>Введіть мінімальних підписників (10-50,000):</b>\n\nБот відфільтрує пусті або мікро-акаунти."
      }
    },
    video: {
      "🎬 Відео-генератор": {
        text: "🎬 <b>Модуль Відео-генератора Shorts/Reels:</b>\n\nОберіть дію:",
        inline: [
          { text: "✍️ Написати ідею", callback: "v_idea" },
          { text: "🆕 Створити відео", callback: "v_new" },
          { text: "⚙️ Параметри відео (FPS, AR)", callback: "v_settings" }
        ]
      },
      "🎨 HTML-Каруселі": {
        text: "🎨 <b>HTML-Каруселі:</b>\n\nПеремикаю інтерфейс на модуль каруселей. Натисніть кнопку '🎨 HTML Карусель'."
      },
      "🖼️ Моя Галерея": {
        text: "📂 <b>Ваша Галерея фонових медіа:</b>\n\n• 📁 <code>backgrounds/chill</code> (12)\n• 📁 <code>backgrounds/phonk</code> (7)\n\nОберіть дію:",
        inline: [
          { text: "➕ Створити папку", callback: "v_dir" },
          { text: "➕ Завантажити фото", callback: "v_up" }
        ]
      },
      "👤 Мої Автори": {
        text: "👤 <b>Ваші speaker-оратори (rembg):</b>\n\n• 👤 <code>author_steve.png</code> (очищений фон)\n• 👤 <code>author_elon.png</code> (очищений фон)\n\nОберіть дію:",
        inline: [
          { text: "➕ Додати автора", callback: "v_author" }
        ]
      },
      // Inlines Callback Replies
      "v_idea": {
        text: "🎲 <b>ШІ вигадує тему та пише сценарій...</b>\n\nСценарій готовий. Запущено ElevenLabs озвучення..."
      },
      "v_new": {
        text: "📝 Надішліть готовий текст сценарію у чат. Бот розіб'є його на сцени та змонтує Shorts."
      },
      "v_settings": {
        text: "⚙️ <b>Технічні параметри відео монтажу:</b>\n\nФормат: <i>9:16 (Shorts)</i>\nПлавність: <i>30 FPS</i>\nФонова музика: <i>Lofi Chill</i>"
      },
      "v_dir": {
        text: "📝 Введіть назву нової папки галереї:"
      },
      "v_up": {
        text: "📥 Надішліть зображення для завантаження у галерею."
      },
      "v_author": {
        text: "📥 Надішліть фото спікера. Бот автоматично видалить фон за допомогою <code>rembg segmentation</code>."
      }
    }
  };

  // Find mapping from callback key to button label text for inline buttons
  function findInlineLabel(botId, callbackKey) {
    const botDb = botReplies[botId];
    if (!botDb) return null;
    for (const key in botDb) {
      const data = botDb[key];
      if (data.inline) {
        for (const item of data.inline) {
          if (item.callback === callbackKey) return item.text;
        }
      }
    }
    return null;
  }

  // Click Handler for Bot Keyboard Buttons
  document.querySelectorAll('.tg-kbd-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const botId = btn.dataset.bot;
      const text = btn.dataset.text;
      
      handleBotInteraction(botId, text);
    });
  });

  // Clear chat handler
  document.querySelectorAll('.tg-clear-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const botId = btn.dataset.bot;
      const messagesContainer = document.getElementById(`tg-messages-${botId}`);
      if (messagesContainer) {
        // Keep only the first bot message (greeting)
        while (messagesContainer.children.length > 1) {
          messagesContainer.removeChild(messagesContainer.lastChild);
        }
      }
    });
  });

  // Send message from input field
  document.querySelectorAll('.tg-send-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const botId = btn.dataset.bot;
      const input = document.getElementById(`tg-input-${botId}`);
      if (input && input.value.trim()) {
        handleBotInteraction(botId, input.value.trim());
        input.value = '';
      }
    });
  });

  // Enter key to send
  document.querySelectorAll('.tg-input-field').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const botId = input.dataset.bot;
        if (input.value.trim()) {
          handleBotInteraction(botId, input.value.trim());
          input.value = '';
        }
      }
    });
  });

  // Handle Telegram Bot Simulations
  function handleBotInteraction(botId, textOrCallback, isCallback = false) {
    const messagesContainer = document.getElementById(`tg-messages-${botId}`);
    if (!messagesContainer) return;

    // Check if bot is already typing
    if (messagesContainer.querySelector('.tg-typing')) return;

    let userText = textOrCallback;
    let dbKey = textOrCallback;

    // For inline callbacks, show the button label as user message
    if (isCallback) {
      const label = findInlineLabel(botId, textOrCallback);
      userText = label || textOrCallback;
    }

    // Append User Message bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'tg-message user';
    userBubble.textContent = userText;
    messagesContainer.appendChild(userBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Append Typing status
    const typingBubble = document.createElement('div');
    typingBubble.className = 'tg-typing';
    typingBubble.textContent = 'Друкує...';
    messagesContainer.appendChild(typingBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulate Network / API latency
    setTimeout(() => {
      // Remove typing indicator
      typingBubble.remove();

      // Retrieve reply data
      const botDb = botReplies[botId];
      const replyData = botDb ? botDb[dbKey] : null;

      const replyBubble = document.createElement('div');
      replyBubble.className = 'tg-message bot';
      
      if (replyData) {
        replyBubble.innerHTML = replyData.text;
        
        // Render Inline buttons if exists
        if (replyData.inline) {
          const inlineContainer = document.createElement('div');
          inlineContainer.className = 'tg-inline-kbd';
          
          replyData.inline.forEach(item => {
            const inlineBtn = document.createElement('button');
            inlineBtn.className = 'tg-inline-btn';
            inlineBtn.textContent = item.text;
            inlineBtn.addEventListener('click', () => {
              handleBotInteraction(botId, item.callback, true);
            });
            inlineContainer.appendChild(inlineBtn);
          });
          
          replyBubble.appendChild(inlineContainer);
        }
      } else {
        replyBubble.textContent = `Команда прийнята на опрацювання.`;
      }

      messagesContainer.appendChild(replyBubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 800);
  }


  // ==========================================
  // 4. Tech Stack Interactive Popups & Category Modals
  // ==========================================
  const techPopupOverlay = document.getElementById('tech-popup-overlay');
  const techPopup = document.getElementById('tech-popup');
  const techPopupTitle = document.getElementById('tech-popup-title');
  const techPopupDesc = document.getElementById('tech-popup-desc');
  const techPopupTags = document.getElementById('tech-popup-tags');
  const techPopupClose = document.getElementById('tech-popup-close');
  
  const techCategoryOverlay = document.getElementById('tech-category-overlay');
  const techCategoryModals = document.querySelectorAll('.tech-category-modal');
  
  // Tech Stack Accordion functionality - expand/collapse grid on click
  const techCategoryTitles = document.querySelectorAll('.tech-category-title');
  
  // Initially hide all tech grids
  document.querySelectorAll('.tech-grid').forEach(grid => {
    grid.style.display = 'none';
  });
  
  techCategoryTitles.forEach(title => {
    title.style.cursor = 'pointer';
    title.addEventListener('click', () => {
      const wrapper = title.closest('.tech-category-wrapper');
      const grid = wrapper.querySelector('.tech-grid');
      
      // Toggle this grid
      if (grid.style.display === 'none' || grid.style.display === '') {
        grid.style.display = 'grid';
        wrapper.classList.add('expanded');
      } else {
        grid.style.display = 'none';
        wrapper.classList.remove('expanded');
      }
    });
  });

  const techData = {
    python: { title: '🐍 Python', desc: 'Основна мова для бекенду, ботів, парсерів та AI-інтеграцій. Використовується в усіх проєктах завдяки потужній екосистемі бібліотек.', tags: ['AIogram', 'Playwright', 'MoviePy', 'Celery', 'FastAPI'] },
    nodejs: { title: '🟢 Node.js / TypeScript', desc: 'Для високопродуктивних API, WebSocket-серверів та інтеграцій. TypeScript додає типізацію для надійності коду.', tags: ['Express', 'WebSockets', 'WS', 'npm'] },
    gemini: { title: '🤖 Gemini API', desc: 'Використовується в Tetiana AI для RAG-відповідей за базою знань. Потужна мультимодальна модель від Google з підтримкою PDF, зображень та відео.', tags: ['RAG', 'Embeddings', 'Context AI'] },
    openai: { title: '🧠 OpenAI / GPT', desc: 'Застосовується в Carousel Generator для написання контенту та копірайтингу. Генерація текстів за шаблонами з урахуванням tone of voice.', tags: ['GPT-4', 'Text Gen', 'Carousel'] },
    whisper: { title: '🎤 Whisper', desc: 'Система розпізнавання мовлення від OpenAI. Використовується в Tetiana AI для транскрипції голосових повідомлень та аудіо з YouTube.', tags: ['Speech-to-Text', 'Transcribe', 'OCR'] },
    elevenlabs: { title: '🗣️ ElevenLabs', desc: 'Синтез мовлення з високою якістю. Застосовується в AI Video Factory для озвучення сценаріїв голосом диктора.', tags: ['TTS', 'Voiceover', 'Video'] },
    opencv: { title: '👁️ OpenCV (OCR)', desc: 'Бібліотека комп\'ютерного зору. В Tetiana AI використовується для OCR-розпізнавання тексту на фото та сканованих PDF.', tags: ['OCR', 'Image Processing', 'CV'] },
    aiogram: { title: '🤖 AIogram / Telebot', desc: 'Фреймворки для створення Telegram-ботів на Python. Використовуються в усіх бот-проєктах (Tetiana, Threads, Carousel та ін.).', tags: ['Telegram Bot', 'Async', 'Webhook'] },
    n8n: { title: '🔗 n8n Workflows', desc: 'Low-code платформа для автоматизації. Створення сценаріїв інтеграції між CRM, платіжними системами та Google-сервісами.', tags: ['Automation', 'Low-Code', 'Webhooks'] },
    websockets: { title: '🌐 WebSockets', desc: 'Протокол реального часу. Використовується в Crypto Screener для отримання ринкових даних з Binance/Bybit в реальному часі.', tags: ['Real-time', 'Streaming', 'Crypto'] },
    stripe: { title: '💳 Stripe API', desc: 'Платіжний шлюз для прийому оплат. Інтегрується з n8n для автостворення угод у CRM після успішних транзакцій.', tags: ['Payments', 'API', 'Billing'] },
    hubspot: { title: '📊 HubSpot API', desc: 'CRM-платформа для управління клієнтами. Автоматична синхронізація угод, контактів та угод через n8n.', tags: ['CRM', 'API', 'Automation'] },
    threads: { title: '📱 Threads API', desc: 'API соцмережі Meta Threads. Використовується в Threads Hunter для пошуку постів за ключовими словами та збору лідів.', tags: ['Social Media', 'Scraping', 'Leads'] },
    google: { title: '🔍 Google Search', desc: 'Пошуковий сканер для InstaLeadScout. Знаходить бізнес-профілі Instagram через Google, оминаючи ліміти Instagram API.', tags: ['Search', 'Crawling', 'Scraping'] },
    youtube: { title: '▶️ YouTube API', desc: 'API для роботи з відео YouTube. В Tetiana AI використовується для завантаження аудіо та субтитрів з відео за посиланням.', tags: ['Video', 'Transcribe', 'API'] },
    drive: { title: '📁 Google Drive API', desc: 'Хмарне сховище для файлів. Інтеграція для автоматичного збереження звітів, експортів PDF/CSV та бекапів даних.', tags: ['Cloud', 'Storage', 'Backup'] },
    docs: { title: '📄 Google Docs API', desc: 'API для роботи з Google Документами. Автоматичне створення звітів, комерційних пропозицій та документації.', tags: ['Documents', 'API', 'Reports'] },
    airtable: { title: '📋 Airtable', desc: 'Low-code база даних з інтерфейсом таблиць. Використовується як легка CRM та для організації лідів з подальшою синхронізацією.', tags: ['Database', 'No-Code', 'CRM'] },
    supabase: { title: '⚡ Supabase', desc: 'Open-source альтернатива Firebase. PostgreSQL + Auth + Storage в одному сервісі для швидкого запуску бекенду.', tags: ['PostgreSQL', 'Auth', 'Realtime'] },
    postgresql: { title: '🐘 PostgreSQL', desc: 'Реляційна база даних. Використовується в Crypto Screener та IntegFlow для зберігання ринкових даних та логів інтеграцій.', tags: ['SQL', 'Database', 'Relational'] },
    sqlite: { title: '🗄️ SQLite', desc: 'Легка вбудована база даних. Використовується в усіх Telegram-ботах для зберігання налаштувань, лідів та історії.', tags: ['Database', 'Embedded', 'Local'] },
    pinecone: { title: '🔷 Pinecone / FAISS', desc: 'Векторні бази для пошуку за семантикою. В Tetiana AI зберігають ембеддінги документів для швидкого RAG-пошуку.', tags: ['Vector DB', 'RAG', 'Semantic Search'] },
    docker: { title: '🐳 Docker', desc: 'Контейнеризація додатків. Використовується для ізольованого запуску ботів, бази даних та AI-сервісів.', tags: ['Containers', 'DevOps', 'Deploy'] },
    playwright: { title: '🎭 Playwright', desc: 'Браузерна автоматизація. Застосовується для скрейпінгу Instagram, рендеру HTML-каруселей у PNG та обходу Cloudflare.', tags: ['Browser', 'Scraping', 'Rendering'] },
    moviepy: { title: '🎬 MoviePy', desc: 'Бібліотека для монтажу відео на Python. В AI Video Factory компонує сцени, накладає текст, фон та аудіо в готовий MP4.', tags: ['Video Edit', 'FFmpeg', 'Compositing'] },
    celery: { title: '⏱️ Celery', desc: 'Система асинхронних задач. В AI Video Factory обробляє відео-рендер у фоновому режимі без блокування бота.', tags: ['Async', 'Queue', 'Background'] },
    reportlab: { title: '📊 ReportLab', desc: 'Бібліотека для генерації PDF. В Threads Hunter створює професійні звіти про знайдених лідів з усіма контактними даними.', tags: ['PDF', 'Reports', 'Export'] },
    rembg: { title: '✂️ rembg', desc: 'Видалення фону на зображеннях за допомогою ШІ. В AI Video Factory очищує фон на фото ораторів для створення аватарів.', tags: ['Image', 'Background', 'AI'] }
  };

  // Tech icons mapping
  const techIcons = {
    python: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>',
    nodejs: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>',
    gemini: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>',
    openai: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>',
    whisper: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1M18 8h4v8h-4M22 12h-4" /></svg>',
    elevenlabs: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>',
    opencv: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3L6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>',
    aiogram: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>',
    n8n: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="5" r="3" /><circle cx="12" cy="19" r="3" /><circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M5 12h14M12 5v14" /></svg>',
    websockets: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" /></svg>',
    stripe: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>',
    hubspot: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>',
    threads: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>',
    google: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>',
    youtube: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /><rect x="2" y="3" width="20" height="18" rx="2" ry="2" /></svg>',
    drive: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /><line x1="12" y1="22" x2="12" y2="15.5" /><polyline points="22 8.5 12 15.5 2 8.5" /></svg>',
    docs: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>',
    airtable: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="3" x2="9" y2="21" /></svg>',
    supabase: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 15c2 0 4-2 6-2s4 2 6 2 4-2 6-2" /><path d="M4 19c2 0 4-2 6-2s4 2 6 2 4-2 6-2" /><path d="M4 11c2 0 4-2 6-2s4 2 6 2 4-2 6-2" /><path d="M4 7c2 0 4-2 6-2s4 2 6 2 4-2 6-2" /></svg>',
    postgresql: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></svg>',
    sqlite: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></svg>',
    pinecone: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>',
    docker: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><box x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18" /></svg>',
    playwright: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v12M6 12h12" /></svg>',
    moviepy: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>',
    celery: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>',
    reportlab: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>',
    rembg: '<svg class="tech-category-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>'
  };

  function showTechPopup(card) {
    const tech = card.dataset.tech;
    const data = techData[tech];
    if (!data) return;

    techPopupTitle.textContent = data.title;
    techPopupDesc.textContent = data.desc;
    techPopupTags.innerHTML = data.tags.map(t => `<span class="tech-popup-tag">${t}</span>`).join('');

    // Position popup near the card
    const rect = card.getBoundingClientRect();
    const popupW = techPopup.offsetWidth || 300;
    const popupH = techPopup.offsetHeight || 200;
    let left = rect.left + rect.width / 2 - popupW / 2;
    let top = rect.bottom + 10;

    // Ensure it stays within viewport
    if (left < 10) left = 10;
    if (left + popupW > window.innerWidth - 10) left = window.innerWidth - popupW - 10;
    if (top + popupH > window.innerHeight - 10) top = rect.top - popupH - 10;

    techPopup.style.left = left + 'px';
    techPopup.style.top = top + 'px';

    techPopupOverlay.classList.add('open');
    techPopup.classList.add('open');
  }

  function hideTechPopup() {
    techPopupOverlay.classList.remove('open');
    techPopup.classList.remove('open');
  }

  // Tech card click handler - show popup
  document.querySelectorAll('.tech-card[data-tech]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      // Don't open if already open for this card (close instead)
      if (techPopup.classList.contains('open') && techPopup.dataset.activeTech === card.dataset.tech) {
        hideTechPopup();
        return;
      }
      showTechPopup(card);
      techPopup.dataset.activeTech = card.dataset.tech;
    });
  });

  techPopupClose.addEventListener('click', hideTechPopup);
  techPopupOverlay.addEventListener('click', hideTechPopup);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && techPopup.classList.contains('open')) {
      hideTechPopup();
    }
  });

  // Category Modal Functions
  function openTechCategoryModal(modal) {
    const category = modal.dataset.category;
    
    // Populate the modal with tech cards
    const grid = modal.querySelector('.tech-category-modal-grid');
    grid.innerHTML = '';
    
    // Get all tech cards from the original grid
    const originalCards = document.querySelectorAll(`.tech-card[data-category="${category}"]`);
    
    originalCards.forEach(card => {
      const tech = card.dataset.tech;
      const data = techData[tech];
      if (!data) return;
      
      const modalCard = document.createElement('div');
      modalCard.className = 'tech-category-modal-card';
      modalCard.innerHTML = `
        ${techIcons[tech] || ''}
        <div class="tech-category-modal-name">${data.title.split(' ')[1] || data.title}</div>
        <div class="tech-category-modal-label">${tech}</div>
      `;
      
      // Add click handler to show popup
      modalCard.addEventListener('click', (e) => {
        e.stopPropagation();
        // Find the original card in the small grid and trigger its click
        const originalCard = document.querySelector(`.tech-card[data-tech="${tech}"]`);
        if (originalCard) {
          showTechPopup(originalCard);
          techPopup.dataset.activeTech = tech;
        }
      });
      
      grid.appendChild(modalCard);
    });
    
    // Show the modal
    techCategoryOverlay.classList.add('open');
    modal.classList.add('open');
  }

  function closeTechCategoryModals() {
    techCategoryOverlay.classList.remove('open');
    techCategoryModals.forEach(modal => {
      modal.classList.remove('open');
    });
  }

  // Category modal close button handlers
  document.querySelectorAll('.tech-category-modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeTechCategoryModals();
    });
  });

  // Close modals when clicking on overlay
  techCategoryOverlay.addEventListener('click', closeTechCategoryModals);

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && techCategoryOverlay.classList.contains('open')) {
      closeTechCategoryModals();
    }
  });

  // ==========================================
  // 5. ROI Calculator
  // ==========================================
  const calcBtnOptions = document.querySelectorAll('.calc-btn-option');
  const sliderHours = document.getElementById('slider-hours');
  const sliderHoursVal = document.getElementById('slider-hours-val');
  const sliderRate = document.getElementById('slider-rate');
  const sliderRateVal = document.getElementById('slider-rate-val');
  
  const calcValMoney = document.getElementById('calc-val-money');
  const calcValHours = document.getElementById('calc-val-hours');
  const calcValYearly = document.getElementById('calc-val-yearly');
  const calcValPayback = document.getElementById('calc-val-payback');

  let currentTypeFactor = 1.0;
  let estimatedProjectCost = 25000; // Base cost for CRM Sync

  const projectCosts = {
    'Ручне введення даних / Звіти': 25000,
    'Обробка клієнтів / Підтримка': 40000,
    'Збір та аналіз даних': 18000,
    'Створення контенту': 22000
  };

  calcBtnOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      calcBtnOptions.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
      currentTypeFactor = parseFloat(btn.dataset.factor);
      
      const optionName = btn.textContent.trim();
      estimatedProjectCost = projectCosts[optionName] || 25000;
      
      updateCalculator();
    });
  });

  sliderHours.addEventListener('input', () => {
    sliderHoursVal.textContent = `${sliderHours.value} годин`;
    updateCalculator();
  });

  sliderRate.addEventListener('input', () => {
    sliderRateVal.textContent = `${parseInt(sliderRate.value).toLocaleString('uk-UA')} ₴ / год`;
    updateCalculator();
  });

  function updateCalculator() {
    const hoursPerWeek = parseInt(sliderHours.value);
    const hourlyRate = parseInt(sliderRate.value);

    // Automation optimization calculations (saves ~90% of hours)
    const automatedHoursPerWeek = hoursPerWeek * 0.9 * currentTypeFactor;
    const monthlyHoursSaved = Math.round(automatedHoursPerWeek * 4.33);
    const monthlyMoneySaved = Math.round(monthlyHoursSaved * hourlyRate);
    const yearlyMoneySaved = monthlyMoneySaved * 12;

    const paybackMonths = Math.max(1, Math.round((estimatedProjectCost / monthlyMoneySaved) * 10) / 10);
    let paybackText = `${paybackMonths} міс`;
    if (paybackMonths <= 1) {
      paybackText = 'менше 1 міс';
    } else if (paybackMonths > 1 && paybackMonths < 2) {
      paybackText = '1-1.5 міс';
    } else if (paybackMonths >= 2 && paybackMonths <= 3) {
      paybackText = '2-3 міс';
    } else {
      paybackText = `${Math.ceil(paybackMonths)} міс`;
    }

    animateNumberValue(calcValHours, monthlyHoursSaved, ' год');
    animateNumberValue(calcValMoney, monthlyMoneySaved, ' ₴');
    
    let yearlyText = '';
    if (yearlyMoneySaved >= 1000000) {
      yearlyText = `${(yearlyMoneySaved / 1000000).toFixed(1)}M ₴`;
    } else if (yearlyMoneySaved >= 1000) {
      yearlyText = `${Math.round(yearlyMoneySaved / 1000)}k ₴`;
    } else {
      yearlyText = `${yearlyMoneySaved} ₴`;
    }
    calcValYearly.textContent = yearlyText;
    calcValPayback.textContent = paybackText;
  }

  // Smooth counter animation
  function animateNumberValue(element, targetValue, suffix = '') {
    const startValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
    if (startValue === targetValue) {
      element.textContent = targetValue.toLocaleString('uk-UA') + suffix;
      return;
    }
    
    const duration = 400; // ms
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
      
      element.textContent = currentValue.toLocaleString('uk-UA') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }

    requestAnimationFrame(updateNumber);
  }

  // Run initial calculations on load
  updateCalculator();


  // ==========================================
  // 6. Contact Form Handling
  // ==========================================
  const contactForm = document.getElementById('project-contact-form');
  const formStatus = document.getElementById('form-status');
  const btnSubmit = document.getElementById('btn-submit-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Надсилання...';
    formStatus.textContent = '';
    formStatus.style.color = 'var(--text-muted)';

    setTimeout(() => {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Надіслати запит';
      
      formStatus.style.color = 'var(--emerald)';
      formStatus.textContent = 'Дякую! Заявку успішно відправлено. Зв\'яжуся з вами протягом 2 годин.';
      
      contactForm.reset();
      
      setTimeout(() => {
        formStatus.textContent = '';
      }, 7000);
      
    }, 1200);
  });

  // Set current time in status bar dynamically
  function updateStatusBarTime() {
    document.querySelectorAll('.status-time').forEach(timeEl => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      timeEl.textContent = `${hours}:${minutes}`;
    });
  }
  updateStatusBarTime();
  setInterval(updateStatusBarTime, 60000);

});
