Модификация скрипта для динамического ID Метрики

Твой текущий код в widget.js жёстко прописывает ID Метрики (83703373) в вызове ym.
Нужно сделать так, чтобы ID брался динамически, например, из query-параметра в URL скрипта (<script src="https://captcha-server-technotim.vercel.app/widget.js?metric_id=XXXX"></script>).

Основные изменения:

Добавлен парсинг metric_id из URL через URLSearchParams.
Проверка if (metricId && typeof ym === 'function') — отправляем событие только если ID указан и Метрика загружена.
Обработка ошибок через try/catch на случай, если Метрика не инициализирована.
Если metric_id не передан, событие в Метрику не отправляется, но CAPTCHA всё равно работает.

Как это работает:

Пользователь подключает скрипт: <script src="https://captcha-server-technotim.vercel.app/widget.js?metric_id=12345678"></script>.
Скрипт читает metric_id=12345678 и использует его в ym(12345678, 'reachGoal', 'valid_user').
Если параметр не указан, Метрика игнорируется, но CAPTCHA продолжает работать.
