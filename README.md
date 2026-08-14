# Readora — Rəqəmsal Kitabxana Platforması

Full-stack kitab rezervasiya və icarə sistemi. Node.js/Express/MongoDB backend, React/Vite frontend.

## Xüsusiyyətlər

- Admin qeydiyyatı və girişi (JWT, bcrypt)
- Kitabların axtarışı və səhifələnməsi (pagination)
- Rezervasiya sistemi (özün götür / evə çatdırılma)
- İcarə sistemi, gecikmə cəriməsi hesablanması
- İstək siyahısı (Wishlist)
- Kitab rəyləri və reytinqi
- Admin panel: kitab, rezervasiya, icarə, çatdırılma idarəetməsi

## Texnologiyalar

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Joi
**Frontend:** React, Vite, React Router, Axios, SCSS Modules, react-hot-toast

## Quraşdırma

### Backend

```bash
cd backend
npm install
cp .env.example .env
# .env faylında DB_BASE_URL və JWT_SECRET dəyərlərini doldur
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Dəyişənləri

`backend/.env.example` faylına bax:

- `PORT` — server portu (default: 3300)
- `DB_BASE_URL` — MongoDB bağlantı URI-si
- `JWT_SECRET` — JWT tokenlərin imzalanması üçün gizli açar

## Admin Girişi

Admin panel yalnız `role: "admin"` olan istifadəçilər üçün açıqdır. Yeni admin hesabı yaratmaq üçün:

1. Adi qeydiyyat endpoint-i (`POST /register`) ilə istifadəçi yarat
2. MongoDB-də həmin istifadəçinin `role` sahəsini `"admin"` et
3. `/admin/login` ünvanından daxil ol

## Qovluq Strukturu

```
backend/
  src/
    config/       - DB bağlantısı
    constants/    - endpoint yolları
    controllers/  - route məntiqi
    middlewares/  - auth, validation, admin yoxlaması
    models/       - Mongoose sxemləri
    routes/       - Express router-lər
    utils/        - köməkçi funksiyalar
    validation/   - Joi sxemləri
frontend/
  src/
    components/   - təkrar istifadə olunan UI hissələri
    context/      - React Context (Wishlist)
    layouts/      - Navbar, Footer, Admin/Main layout-lar
    pages/        - səhifələr (admin daxil)
    routes/       - React Router konfiqurasiyası
```