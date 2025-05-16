// Проверка формы и вывод сообщения
const form = document.getElementById('contact');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Отмена стандартного действия формы

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && email && message && checkEmail(email)) {
        try {
            const res = await fetch("/send", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: name,
                    to: email,
                    text: message
                })
            });

            console.log(res);

            const result = await res.json();

            if (result.success) {
                alert(result.message);
            } else {
                alert("Ошибка: " + result.message);
            }
        } catch (err) {
            alert("Произошла ошибка при отправке данных");
            console.error(err);
        }

        event.target.reset();
    } else {
        alert('Пожалуйста, заполните все поля формы');
    }
});

// Проверка почты
function checkEmail(email) {
    const regex_Expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex_Expression.test(email.toLowerCase());
}