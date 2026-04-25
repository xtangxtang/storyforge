# Storyforge

AI-powered short video creation tool. Turn a simple idea into a 1-2 minute video.

## Workflow

```
创意提示词 → 策划 → 编剧 → 资产 → 分镜 → 出视频 → 出片
```

## Architecture

4-Agent system orchestrated by a DirectorAgent:

```
                    DirectorAgent (orchestrator)
                    ├── PlanningAgent (创意策划)
                    ├── ScriptAgent (编剧 + 资产提取)
                    └── ProductionAgent (分镜 + 视频 + 出片)
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 5 + TypeScript
- **Database**: SQLite (better-sqlite3 + knex)
- **Validation**: Zod
- **File Storage**: Local filesystem

## Quick Start

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start dev server (port 3000)
npm run dev
```

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/files/*` | Static file access |
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List projects |
| GET | `/api/projects/:id` | Get project |
| DELETE | `/api/projects/:id` | Delete project |
| PATCH | `/api/projects/:id/state` | Update project state |
| POST | `/api/projects/:id/brief` | Generate brief |
| GET | `/api/projects/:id/brief` | Get brief |
| POST | `/api/projects/:id/script` | Generate script |
| GET | `/api/projects/:id/script` | Get script |
| GET | `/api/projects/:id/assets` | List assets |
| POST | `/api/projects/:id/assets` | Create asset |
| GET | `/api/projects/:id/storyboards` | List storyboards |
| POST | `/api/projects/:id/storyboards` | Create storyboard |
| POST | `/api/projects/:id/videos` | Trigger video generation |
| GET | `/api/projects/:id/videos` | List video clips |
| GET | `/api/tasks` | List tasks |
| GET | `/api/templates` | List templates |

## Project Structure

```
storyforge/
├── src/
│   ├── app.ts                    # Express app entry
│   ├── config/                   # Configuration
│   ├── core/                     # Agent framework
│   ├── lib/                      # Database & migrations
│   ├── routes/                   # API route handlers
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utilities
├── data/
│   ├── db/                       # SQLite database
│   ├── projects/                 # Per-project files
│   └── templates/                # Preset templates
└── package.json
```

## Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run production build
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database
```

## Related

- [Frontend](https://github.com/xtangxtang/storyforge-frontend) — React Native app

## License

ISC
