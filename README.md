# Бурение скважин в Свердловской области — лендинг

Чистая статическая пересборка лендинга, изначально собранного на Creatium.
Без билдеров, без фреймворков, без мусорного CSS — только HTML, CSS и
локальные картинки. Готов к загрузке на GitHub Pages.

## Структура (воронка из 5 страниц)

```
landing/
├── index.html         # страница 1 — Hero + Matrix-метафора + CTA → page2.html
├── page2.html         # страница 2 — Тихий саботаж: 3 ловушки → page3.html
├── page3.html         # страница 3 — 5 обязательных правил → page4.html
├── page4.html         # страница 4 — Выбор места: 4 шага + «чего нельзя» → page5.html
├── page5.html         # страница 5 — Рецепт скважины + квиз-форма (финал воронки)
├── styles.css         # стили (палитра и типографика сняты с оригинала)
├── app.js             # пульсация фото при скролле (IntersectionObserver)
├── README.md          # этот файл
└── assets/            # все картинки, скачанные локально
```

## Что соответствует оригиналу

- ✅ Весь текст дословно на всех 5 страницах
- ✅ Палитра снята попиксельно: акцентный зелёный `#70AD47`, тёмно-зелёный `#51A72A`,
  бейджи `#F88A8A`/`#A2B992`/`#77D1F1`, жёлтый CTA-градиент
- ✅ Шрифт Manrope (бесплатный аналог платного TTNorms Medium)
- ✅ Размеры шрифтов выверены через `getComputedStyle` на каждой странице
- ✅ Контакты: `tel:+73433123828`, MAX `https://max.ru/u/f9LHodD0cOJi_...`
- ✅ Telegram-канал: `https://t.me/prochistcervise/260`
- ✅ Адаптив: 3 брейкпоинта (desktop / tablet / small mobile)

## Деплой на GitHub Pages

1. Создай репозиторий на GitHub, например `burenie-landing`.
2. Залей содержимое папки `landing/` в корень:
   ```bash
   cd landing
   git init && git add . && git commit -m "Лендинг — 5 страниц воронки"
   git branch -M main
   git remote add origin https://github.com/<твой-логин>/burenie-landing.git
   git push -u origin main
   ```
3. На GitHub: **Settings → Pages → Source → main / root → Save**.
4. Через 1–2 минуты сайт будет на `https://<твой-логин>.github.io/burenie-landing/`.

## Локальный предпросмотр

```bash
cd landing
python3 -m http.server 8080
# открой http://localhost:8080
```

## Подключение бэкенда для квиза (страница 5)

Форма квиза на `page5.html` уже обёрнута в `<form>` с `action` и `method="POST"`.
Все поля имеют `name` и `value` атрибуты, так что данные готовы к отправке.

### Что отправляет форма

| Поле          | name       | Тип    | Значение                              |
|---------------|------------|--------|---------------------------------------|
| Вопрос 1      | `q1`       | radio  | ВОДА В ДОМЕ / НА ДАЧЕ / ПОЛИВ / СТРОЙ |
| Вопрос 2      | `q2`       | radio  | ЛЕТНЯЯ КОЛОНКА / КЕССОН / НЕ ОПРЕД.   |
| Вопрос 3      | `q3`       | radio  | 15-30 / 30-60 / 60-100 / 100-200 / …  |
| Вопрос 4      | `q4`       | radio  | В MAX / В Telegram / По телефону      |
| Локация       | `location` | text   | Населённый пункт                      |
| Телефон       | `phone`    | tel    | +7 XXX XXX-XX-XX                      |
| Согласие      | `consent`  | checkbox | on                                  |

### Вариант 1 — Formspree (быстро, без кода, бесплатно до 50 заявок/мес)

1. Зарегистрируйся на [formspree.io](https://formspree.io).
2. Создай новую форму, скопируй endpoint вида `https://formspree.io/f/abcdwxyz`.
3. В `page5.html` замени `action`:
   ```html
   <form class="card card--quiz" id="quiz-form"
         action="https://formspree.io/f/abcdwxyz" method="POST">
   ```
4. Готово. Заявки придут на твой e-mail. На бесплатном тарифе 50 заявок/мес.

### Вариант 2 — Telegram-бот (заявки прямо в чат, без сервера)

1. Создай бота через [@BotFather](https://t.me/BotFather), получи токен.
2. Узнай свой chat_id через [@userinfobot](https://t.me/userinfobot).
3. Добавь в конец `page5.html` перед `</body>`:
   ```html
   <script>
     const TOKEN = 'ТВОЙ_ТОКЕН_БОТА';
     const CHAT_ID = 'ТВОЙ_CHAT_ID';
     document.getElementById('quiz-form').addEventListener('submit', async (e) => {
       e.preventDefault();
       const data = new FormData(e.target);
       const msg = [...data.entries()].map(([k,v]) => `${k}: ${v}`).join('\n');
       await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({chat_id: CHAT_ID, text: msg})
       });
       alert('Заявка отправлена! Мы свяжемся с вами в течение 2 минут.');
       e.target.reset();
     });
   </script>
   ```
4. Каждая заявка придёт тебе в Telegram-чат с ботом.

### Вариант 3 — Свой бэкенд (Node.js / PHP / Python)

1. Подними endpoint, например `https://твой-домен.ru/api/quiz`.
2. В `page5.html` замени `action` на свой URL.
3. На сервере принимаешь `application/x-www-form-urlencoded` или `multipart/form-data`,
   сохраняешь в БД / шлёшь в CRM / отправляешь на e-mail.
4. Для AJAX-отправки без перезагрузки страницы — добавь JS-обработчик как в варианте 2,
   но с `fetch('https://твой-домен.ru/api/quiz', {method:'POST', body: data})`.

### Вариант 4 — AmoCRM / Битрикс24 (для продажников)

У обеих CRM есть вебхуки «неразобранное». Создай воронку в CRM, скопируй URL вебхука,
поставь его в `action` формы. Заявки будут падать в CRM как новые лиды.

## Контакты и правки

Чтобы поменять телефон / MAX-ссылку / URL кнопки CTA — отредактируй `href` в HTML:

| Что                     | Где искать                          |
|-------------------------|-------------------------------------|
| Телефон                 | `tel:+73433123828`                  |
| MAX (шапка)             | `https://max.ru/u/f9LHodD0cOJi_...` |
| MAX (футер квиза)       | `https://max.ru/id666101677796_biz` |
| Telegram-канал          | `https://t.me/prochistcervise/260`  |
| CTA страница 1 → 2      | `href="page2.html"`                 |
| CTA страница 2 → 3      | `href="page3.html"`                 |
| CTA страница 3 → 4      | `href="page4.html"`                 |
| CTA страница 4 → 5      | `href="page5.html"`                 |
| Action формы квиза      | `action="https://formspree.io/f/..."` |
