// Плавный скролл наверх
const scrollToTopButton = document.getElementById('scroll-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Проверка формы и вывод сообщения
const form = document.getElementById('feedback-form');
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Отмена стандартного действия формы

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name && email && message && checkEmail(email)) {
    alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
    form.reset();
  } 
  else {  
    alert('Пожалуйста, заполните все поля формы.');
  }
});

// Проверка почты
function checkEmail(email) {
  const regex_Expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex_Expression.test(email.toLowerCase());
}