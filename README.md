# Bo Bo Yan Zaw — Full-Stack Developer Portfolio

A creative, animated portfolio + admin panel for a full-stack web developer
(React · Laravel · PHP), built with:

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Zustand** — global state (UI, contact form, admin data)
- **GSAP + ScrollTrigger** — preloader, scroll choreography, magnetic buttons
- **Three.js** (react-three-fiber) — animated hero blob & particles
- **Lenis** — smooth scrolling
- **Prisma ORM + MySQL** — projects & contact messages
- **JWT (jose) httpOnly cookie** — admin authentication

## Features

### Portfolio (`/`)
- Animated preloader with counter
- Three.js hero scene (distorted blob, particle field, wire ring) + staggered text reveal
- Skill marquee strips, scroll-triggered section reveals
- Projects grid loaded from MySQL (falls back to demo data if DB is offline)
- Contact form → stores messages in MySQL via `POST /api/contact`
- Custom cursor, film grain overlay, magnetic buttons, smooth scroll

### Admin Panel (`/admin`)
- Login at `/admin/login` (credentials in `.env`)
- Overview with stats (total / unread messages, project count)
- Messages inbox: read/unread, expand, reply via email, delete
- Full projects CRUD: create/edit/delete, accent color, featured flag, ordering

## Getting Started

```bash
npm install

# 1. Configure your MySQL connection + admin credentials in .env
#    DATABASE_URL="mysql://root:password@localhost:3306/portfolio"
#    ADMIN_EMAIL="admin@devfolio.com"
#    ADMIN_PASSWORD="admin123"
#    AUTH_SECRET="a-long-random-string"

# 2. Create tables
npm run db:migrate        # npx prisma migrate dev

# 3. (Optional) seed demo projects
npm run db:seed

npm run dev               # http://localhost:3000
```

> If MySQL is not reachable, the public site still works — the projects API
> serves demo content and the contact form returns a friendly error.

## API

| Method | Route                     | Auth   | Description                |
| ------ | ------------------------- | ------ | -------------------------- |
| POST   | `/api/contact`            | public | submit a contact message   |
| GET    | `/api/projects`           | public | list projects              |
| POST   | `/api/auth/login`         | public | sign in, sets JWT cookie   |
| POST   | `/api/auth/logout`        | public | clear session              |
| GET    | `/api/admin/messages`     | admin  | messages + stats           |
| PATCH  | `/api/admin/messages/:id` | admin  | mark read/unread           |
| DELETE | `/api/admin/messages/:id` | admin  | delete message             |
| GET    | `/api/admin/projects`     | admin  | list projects (admin view) |
| POST   | `/api/admin/projects`     | admin  | create project             |
| PATCH  | `/api/admin/projects/:id` | admin  | update project             |
| DELETE | `/api/admin/projects/:id` | admin  | delete project             |

## Production

```bash
npm run build
npm run start
```

Set strong values for `ADMIN_PASSWORD` and `AUTH_SECRET` before deploying.
