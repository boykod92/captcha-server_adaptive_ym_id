document.addEventListener('DOMContentLoaded', () => {
  console.log('Капча: инициализация начата');

  // Получаем metric_id из query-параметров URL
  const urlParams = new URLSearchParams(window.location.search);
  const metricId = urlParams.get('metric_id') || null;
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

  // Картинка капчи
  const img = document.createElement('img');
  img.src = 'https://i.imgur.com/CPWtQC9.png';
  img.style.position = 'absolute';
  img.style.width = '20vw';
  img.style.maxWidth = '200px';
  img.style.minWidth = '100px';
  img.style.height = 'auto';
  img.style.cursor = 'pointer';
  overlay.appendChild(img);
  console.log('Капча: изображение создано и добавлено в оверлей');

  // Функция для вычисления актуального размера картинки
  function getImgSize() {
    const size = img.getBoundingClientRect().width;
    console.log(`Капча: размер изображения = ${size}px`);
    return size;
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
    console.log(`Капча: изображение перемещено на x=${newX}, y=${newY}`);
  }
  moveImage();
  const moveInterval = setInterval(moveImage, 2000);
  console.log('Капча: начато периодическое перемещение изображения (интервал 2000ms)');

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
