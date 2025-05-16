require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const publicDir = path.join(__dirname, 'public');

// Email настройка
const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error('Ошибка подключения к SMTP:', err);
    } else {
        console.log('SMTP подключен и готов к отправке писем');
    }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

// Все остальные GET-запросы -> index.html
app.get('/', (req, res) => {
    const indexFile = path.resolve(publicDir, 'index.html');
    res.sendFile(indexFile);
});

// send
app.post('/send', async (req, res) => {
    try {
        // Допустимые поля
        const allowedFields = ['to', 'name', 'text'];

        // Проверка на лишние поля
        const extraFields = Object.keys(req.body).filter(
            field => !allowedFields.includes(field)
        );

        if (extraFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Обнаружены недопустимые поля',
                extraFields: extraFields,
                allowedFields: allowedFields
            });
        }

        // Проверка обязательных полей
        const { to, name, text } = req.body;
        const missingFields = [];

        if (!to) missingFields.push('to');
        if (!name) missingFields.push('name');
        if (!text) missingFields.push('text');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Отсутствуют обязательные поля',
                missingFields: missingFields
            });
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Спасибо за заявку',
            html: `${name}, спасибо за оставленную заявку, она будет рассмотрена в скором времени!\n<i>${text}</i>`,
        });

        res.json({
            success: true,
            message: 'Письмо успешно отправлено',
            messageId: info.messageId
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Ошибка при отправке письма',
            error: {
                code: e.code || 'UNKNOWN_ERROR',
                details: e.response || e.message
            }
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Ошибка:', err);
});