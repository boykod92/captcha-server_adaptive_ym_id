document.addEventListener('DOMContentLoaded', () => {
  console.log('Капча: инициализация начата');

  // Получаем metric_id из URL скрипта
  let metricId = null;
  const scripts = document.getElementsByTagName('script');
  for (const script of scripts) {
    if (script.src.includes('widget.js')) {
      const urlParams = new URLSearchParams(new URL(script.src).search);
      metricId = urlParams.get('metric_id') || null;
      break;
    }
  }
  console.log(`Капча: metric_id = ${metricId}`);

  // Создаём оверлей
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  });
  document.body.appendChild(overlay);
  console.log('Капча: оверлей создан и добавлен в DOM');

  // Картинка капчи в base64
  const base64Image = 'data:image/png;base64,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';

  const img = document.createElement('img');
  img.src = base64Image;
  img.alt = 'Капча: Если вы человек, нажмите на кнопку'; // Для доступности
  img.style.position = 'absolute';
  img.style.width = '20vw';      // 20% ширины экрана
  img.style.maxWidth = '200px';  // не больше 200px
  img.style.minWidth = '100px';  // не меньше 100px
  img.style.height = 'auto';     // сохраняем пропорции
  img.style.cursor = 'pointer';
  overlay.appendChild(img);

  // Функция для вычисления актуального размера картинки
  function getImgSize() {
    return img.getBoundingClientRect().width;
  }

  // Перемещение картинки случайным образом
  function moveImage() {
    const size = getImgSize();
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);
    img.style.left = newX + 'px';
    img.style.top = newY + 'px';
  }
  moveImage();
  const moveInterval = setInterval(moveImage, 3000);

  // Таймер и движение мыши / тача
  let mouseMoves = 0;
  let startTime = Date.now();
  console.log('Капча: таймер запущен, отслеживание движений начато');

  // Порог движений: на мобильных меньше
  const minMoves = /Mobi|Android/i.test(navigator.userAgent) ? 1 : 5;
  console.log(`Капча: устройство = ${/Mobi|Android/i.test(navigator.userAgent) ? 'мобильное' : 'десктоп'}, минимальное количество движений = ${minMoves}`);

  document.addEventListener('mousemove', () => {
    mouseMoves++;
    console.log(`Капча: зафиксировано движение мыши, общее количество движений = ${mouseMoves}`);
  });
  document.addEventListener('touchmove', () => {
    mouseMoves++;
    console.log(`Капча: зафиксировано движение тача, общее количество движений = ${mouseMoves}`);
  });

  // Клик по картинке
  img.addEventListener('click', () => {
    const timeSinceShow = Date.now() - startTime;
    console.log(`Капча: клик по изображению, время с момента показа = ${timeSinceShow}ms, движений = ${mouseMoves}`);

    if (mouseMoves >= minMoves && timeSinceShow >= 500) {
      console.log('Капча: проверка пройдена успешно');
      clearInterval(moveInterval);
      console.log('Капча: интервал перемещения изображения остановлен');
      overlay.remove();
      console.log('Капча: оверлей удалён из DOM');

      // Отправка события в Яндекс.Метрику
      if (metricId && typeof ym === 'function') {
        try {
          ym(metricId, 'reachGoal', 'valid_user');
          console.log(`Капча: событие 'valid_user' отправлено в Яндекс.Метрику с metric_id = ${metricId}`);
        } catch (e) {
          console.error('Капча: ошибка отправки в Яндекс.Метрику:', e);
        }
      }
    } else {
      console.log(`Капча: проверка не пройдена (движений = ${mouseMoves}, время = ${timeSinceShow}ms)`);
      alert('Капча не пройдена, попробуйте ещё раз.');
    }
  });

  console.log('Капча: инициализация завершена');
});


