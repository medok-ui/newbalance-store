<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:111111,100:D4FF00&height=220&section=header&text=New%20Balance&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Интернет-магазин%20кроссовок&descAlignY=55&descSize=18" width="100%"/>

<p>
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/SCSS-Styles-CC6699?style=for-the-badge&logo=sass&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/status-в%20разработке-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/адаптив-пока%20нет-red?style=flat-square" />
  <img src="https://img.shields.io/badge/язык-русский-blue?style=flat-square" />
</p>

</div>

---

## <img src="https://api.iconify.design/lucide/info.svg?color=%23D4FF00" width="20" valign="middle"/> О проекте

Пет-проект интернет-магазина в стиле **New Balance**: каталог кроссовок, фильтры, корзина, избранное, оформление заказа с реальной интеграцией оплаты (в тестовом режиме) и полноценная админ-панель для управления товарами и заказами.

Сделано на **Angular 21** (standalone + signals + SSR) с бэкендом на **Supabase**.

---

## <img src="https://api.iconify.design/lucide/clapperboard.svg?color=%23D4FF00" width="20" valign="middle"/> Демо

<!-- 
  Скриншоты лежат в папке assets-readme/ в корне репозитория.
  Просто закинь туда свои файлы с такими же именами (или поменяй имена ниже под свои).
-->

<div align="center">

<img src="./public/assets-readme/catalog.png" width="48%"/>
<img src="./public/assets-readme/checkout.png" width="48%"/>

<p><i>Каталог и фильтры &nbsp;•&nbsp; Корзина и оформление заказа</i></p>

<img src="./public/assets-readme/profile.png" width="48%"/>
<img src="./public/assets-readme/admin.png" width="48%"/>

<p><i>Личный кабинет &nbsp;•&nbsp; Админ-панель</i></p>

</div>

---

## <img src="https://api.iconify.design/lucide/layers.svg?color=%23D4FF00" width="20" valign="middle"/> Стек технологий

| Категория | Технологии |
|---|---|
| Frontend | Angular 21, TypeScript, SCSS, Angular CDK |
| Backend | Supabase (Auth, Database, Storage, Edge Functions) |
| Оплата | Stripe (тестовый режим) |
| Рендеринг | Angular SSR |

---

## <img src="https://api.iconify.design/lucide/sparkles.svg?color=%23D4FF00" width="20" valign="middle"/> Возможности

<table>
<tr><td width="28"><img src="https://api.iconify.design/lucide/lock.svg?color=%23D4FF00" width="18"/></td><td>Регистрация и авторизация (Supabase Auth)</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/shirt.svg?color=%23D4FF00" width="18"/></td><td>Каталог товаров с фильтрами: пол, размер, цена, рейтинг, метки (new/sale)</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/search.svg?color=%23D4FF00" width="18"/></td><td>Поиск по товарам</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/heart.svg?color=%23D4FF00" width="18"/></td><td>Избранное</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/shopping-cart.svg?color=%23D4FF00" width="18"/></td><td>Корзина с изменением количества и подсчётом стоимости</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/credit-card.svg?color=%23D4FF00" width="18"/></td><td>Оформление заказа и оплата через Stripe</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/ticket-percent.svg?color=%23D4FF00" width="18"/></td><td>Промокоды на скидку</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/user.svg?color=%23D4FF00" width="18"/></td><td>Личный кабинет: профиль, адрес доставки, смена пароля, история заказов</td></tr>
<tr><td><img src="https://api.iconify.design/lucide/layout-dashboard.svg?color=%23D4FF00" width="18"/></td><td>Админ-панель: дашборд со статистикой, товары, заказы, пользователи</td></tr>
</table>

---

## <img src="https://api.iconify.design/lucide/rocket.svg?color=%23D4FF00" width="20" valign="middle"/> Запуск проекта

```bash
# Клонировать репозиторий
git clone https://github.com/medok-ui/newbalance-store.git
cd newbalance-store

# Установить зависимости
npm install

# Запустить дев-сервер
ng serve
```

Приложение будет доступно на `http://localhost:4200/`.

> Для полноценной работы нужен настроенный проект **Supabase** (Auth, таблицы, Storage, Edge Functions) — см. `src/environments/environment.ts` и `supabase/config.toml`.

---

## <img src="https://api.iconify.design/lucide/credit-card.svg?color=%23D4FF00" width="20" valign="middle"/> Тестовая оплата

Оплата в проекте **полностью тестовая** (Stripe test mode) — реальные деньги не списываются, бояться нечего 🙂

| Поле | Значение |
|---|---|
| Номер карты | `4242 4242 4242 4242` |
| Срок действия | любая дата в будущем (например `12/34`) |
| CVC | любые 3 цифры (например `123`) |
| Имя на карте / индекс | любые значения |

---

## <img src="https://api.iconify.design/lucide/ticket-percent.svg?color=%23D4FF00" width="20" valign="middle"/> Промокоды

Промокоды хранятся в таблице `promo_codes` в Supabase и применяются на странице оформления заказа:

| Промокод     | Скидка |
| ------------ | ------ |
| `medok`      | 50%    |
| `baryl`      | 30%    |
| `whitemaks`  | 25%    |
| `friend20`   | 20%    |
| `sneaker15`  | 15%    |
| `nb2026`     | 10%    |

---

## <img src="https://api.iconify.design/lucide/turtle.svg?color=%23D4FF00" width="20" valign="middle"/> Если долго грузится

Supabase и Stripe иногда медленно отвечают в некоторых регионах — если страница долго грузится или зависает, попробуйте включить **VPN**.

---

## <img src="https://api.iconify.design/lucide/wrench.svg?color=%23D4FF00" width="20" valign="middle"/> Статус проекта

| | |
|---|---|
| <img src="https://api.iconify.design/lucide/check.svg?color=%23D4FF00" width="16"/> | Основной функционал магазина работает стабильно |
| <img src="https://api.iconify.design/lucide/x.svg?color=%23D4FF00" width="16"/> | Адаптив под мобильные устройства и планшеты пока не сделан — корректно отображается только на десктопе |
| <img src="https://api.iconify.design/lucide/globe.svg?color=%23D4FF00" width="16"/> | Интерфейс только на русском языке |
| <img src="https://api.iconify.design/lucide/bug.svg?color=%23D4FF00" width="16"/> | Возможны мелкие баги — если нашли что-то не так, пишите админу |

---

## <img src="https://api.iconify.design/lucide/mail.svg?color=%23D4FF00" width="20" valign="middle"/> Контакты

По всем вопросам, багам и предложениям:

<div align="center">

[![Telegram](https://img.shields.io/badge/Telegram-@MedokDev-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/MedokDev)

</div>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:D4FF00,100:111111&height=100&section=footer" width="100%"/>
</div>
