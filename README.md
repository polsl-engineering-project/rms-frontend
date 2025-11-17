# RMS Frontend - High-Performance React/TypeScript Monorepo

A scalable React/TypeScript monorepo built with pnpm workspaces and Turborepo, featuring two client-side applications deployed to Cloudflare Pages with automatic CI/CD.

## 🏗️ Architecture

This monorepo implements a dual-domain architecture:

- **General App** (`apps/general`) → Deployed to `rms-demo.pl`
- **Admin App** (`apps/admin`) → Deployed to `admin.rms-demo.pl`
- **Shared UI Package** (`packages/ui`) → Reusable components library

### Technology Stack

- **Package Manager**: pnpm (efficient, strict dependency management)
- **Build System**: Turborepo (intelligent caching and parallelization)
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite (fast ESM-native builds)
- **Deployment**: Cloudflare Pages (edge-optimized hosting)
- **CI/CD**: GitHub Actions

## 📦 Project Structure

```
rms-frontend/
├── apps/
│   ├── general/          # General user portal
│   │   ├── src/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── .env.template
│   └── admin/            # Admin control panel
│       ├── src/
│       ├── index.html
│       ├── vite.config.ts
│       ├── package.json
│       └── .env.template
├── packages/
│   ├── ui/               # Shared component library (@repo/ui)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── eslint-config/    # Shared ESLint configuration
│       ├── index.js
│       └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD pipeline
├── package.json          # Root package with global scripts
├── pnpm-workspace.yaml   # Workspace definition
├── turbo.json            # Turborepo configuration
├── tsconfig.base.json    # Base TypeScript config
├── .prettierrc           # Prettier configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **pnpm**: v9.0.0 or higher

Install pnpm globally if you haven't already:

```bash
npm install -g pnpm@9
```

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/polsl-engineering-project/rms-frontend.git
cd rms-frontend
```

2. **Install dependencies**:

```bash
pnpm install
```

This command installs all dependencies across the monorepo using pnpm's efficient workspace protocol.

### Environment Configuration

Each application requires environment variables. Copy the template files and configure them:

**General App**:

```bash
cd apps/general
cp .env.template .env
# Edit .env with your configuration
```

**Admin App**:

```bash
cd apps/admin
cp .env.template .env
# Edit .env with your configuration
```

> **Note**: `.env` files are gitignored and should never be committed. Use `.env.template` as a reference.

## 🛠️ Development

### Running Development Servers

**Run all apps in parallel** (recommended):

```bash
pnpm dev
```

This starts both `general` and `admin` apps simultaneously using Turborepo's parallel execution.

**Run individual apps**:

```bash
# General app only
cd apps/general
pnpm dev

# Admin app only
cd apps/admin
pnpm dev
```

### Building for Production

**Build all apps**:

```bash
pnpm build
```

Turborepo automatically:

1. Builds `@repo/ui` first (due to `^build` dependency)
2. Builds both apps in parallel after the UI package is ready
3. Caches results for unchanged packages

**Build individual apps**:

```bash
cd apps/general
pnpm build
```

### Code Quality

**Lint all packages**:

```bash
pnpm lint
```

**Format code**:

```bash
pnpm format
```

**Type checking**:

```bash
pnpm type-check
```

## 📚 Working with the Shared UI Package

The `@repo/ui` package provides reusable components across applications.

### Using Shared Components

Import components using the configured path alias:

```typescript
import { Button, Card } from '@repo/ui';

function MyComponent() {
  return (
    <Card title="Example">
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

### Adding New Components

1. Create your component in `packages/ui/src/components/`:

```typescript
// packages/ui/src/components/MyComponent.tsx
import React from 'react';

export interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

2. Export it from `packages/ui/src/index.ts`:

```typescript
export { MyComponent } from './components/MyComponent';
```

3. The component is now available in all apps via `@repo/ui`

### Path Resolution

TypeScript path resolution is configured in `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/ui": ["packages/ui/src/index.ts"],
      "@repo/ui/*": ["packages/ui/src/*"]
    }
  }
}
```

Vite resolution is handled automatically by the `vite-tsconfig-paths` plugin.

## 🚢 Deployment

### Cloudflare Pages Setup

This project uses **Direct Upload** to Cloudflare Pages for optimal Turborepo cache utilization.

#### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

| Secret Name             | Description                                   | Where to Find                                  |
| ----------------------- | --------------------------------------------- | ---------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | API token with Pages Edit permission          | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID                    | Cloudflare Dashboard → Overview → API section  |
| `PAGES_PROJECT_GENERAL` | Cloudflare Pages project name for general app | e.g., `rms-general-prod`                       |
| `PAGES_PROJECT_ADMIN`   | Cloudflare Pages project name for admin app   | e.g., `rms-admin-prod`                         |

#### Creating Cloudflare Pages Projects

1. **Create two Pages projects** in Cloudflare Dashboard:
   - One for the general app (e.g., `rms-general-prod`)
   - One for the admin app (e.g., `rms-admin-prod`)

2. **Configure custom domains**:
   - General project → `rms-demo.pl`
   - Admin project → `admin.rms-demo.pl`

3. **Disable automatic Git builds** (we use Direct Upload from GitHub Actions)

#### API Token Permissions

Create a custom API token with:

- **Account** → **Cloudflare Pages** → **Edit** permission

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. ✅ Checks out the repository
2. ✅ Sets up Node.js and pnpm
3. ✅ Installs dependencies
4. ✅ Restores Turborepo cache from previous runs
5. ✅ Builds all applications (using cached results when possible)
6. ✅ Deploys general app to Cloudflare Pages
7. ✅ Deploys admin app to Cloudflare Pages

**Trigger**: Automatically runs on every push to `main` branch.

### Build Watch Paths (Optional Optimization)

For advanced optimization, configure Build Watch Paths in Cloudflare Pages dashboard:

**General App Project**:

- Watch paths: `apps/general/**`, `packages/ui/**`

**Admin App Project**:

- Watch paths: `apps/admin/**`, `packages/ui/**`

This prevents unnecessary deployments when only unrelated files change.

## 🔧 Turborepo Configuration

Turborepo tasks are defined in `turbo.json`:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Key Concepts

- **`dependsOn: ["^build"]`**: Ensures dependencies build before dependents
- **`outputs`**: Defines cacheable build artifacts
- **Cache**: Stored in `.turbo/` directory (persisted in CI via GitHub Actions cache)

### Cache Benefits

- ⚡ Local development: Skip rebuilding unchanged packages
- ⚡ CI/CD: Restore previous build results instantly
- ⚡ Team collaboration: Share cache across team members (with Turborepo Remote Cache)

## 📝 Available Scripts

### Root Scripts

| Script              | Description                                 |
| ------------------- | ------------------------------------------- |
| `pnpm dev`          | Run all apps in development mode (parallel) |
| `pnpm build`        | Build all packages and apps                 |
| `pnpm lint`         | Lint all packages                           |
| `pnpm format`       | Format code with Prettier                   |
| `pnpm format:check` | Check code formatting                       |
| `pnpm type-check`   | Run TypeScript type checking                |
| `pnpm clean`        | Remove all build artifacts and caches       |

### Per-App Scripts

All apps support the same scripts:

```bash
cd apps/general  # or apps/admin

pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Lint app code
pnpm type-check   # Type check
pnpm clean        # Clean build artifacts
```

## 🎨 Code Style

### ESLint

Shared ESLint configuration is in `packages/eslint-config/`.

Each package extends the shared config via `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  extends: ['@repo/eslint-config'],
};
```

### Prettier

Prettier configuration is in `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

Auto-format on save is recommended. Configure in VS Code:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 🧩 Adding New Apps or Packages

### Adding a New App

1. Create directory structure:

```bash
mkdir -p apps/new-app/src
```

2. Initialize with `package.json`, `vite.config.ts`, `tsconfig.json`
3. Add app to `pnpm-workspace.yaml` (automatic with `apps/*` pattern)
4. Reference shared packages: `"@repo/ui": "workspace:*"`

### Adding a New Shared Package

1. Create directory:

```bash
mkdir -p packages/new-package/src
```

2. Create `package.json` with internal name: `"name": "@repo/new-package"`
3. Add path alias to `tsconfig.base.json`
4. Export package from consuming apps

## 🐛 Troubleshooting

### Module Resolution Issues

**Problem**: TypeScript can't find `@repo/ui`

**Solution**:

- Verify `tsconfig.base.json` paths are correct
- Ensure `vite-tsconfig-paths` plugin is in `vite.config.ts`
- Run `pnpm install` to refresh workspace links

### Build Failures

**Problem**: App build fails with "Cannot find module"

**Solution**:

- Ensure `turbo.json` has `"dependsOn": ["^build"]`
- Build UI package first: `cd packages/ui && pnpm build`
- Clear Turborepo cache: `rm -rf .turbo`

### Multiple React Instances

**Problem**: "Invalid hook call" or React context issues

**Solution**:

- Add to `vite.config.ts`:
  ```typescript
  resolve: {
    dedupe: ['react', 'react-dom'];
  }
  ```

## 📖 Further Reading

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

## 📄 License

[Your License Here]

## 🤝 Contributing

Contributions are welcome! Please follow the established code style and run tests before submitting PRs.

---

**Built with ❤️ using modern web technologies**
