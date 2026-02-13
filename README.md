[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/DevinCLane/long-covid-dalys)

# Long Covid DALYs

A research project to explore how different public health interventions could improve or worsen the burden of long covid, as measured in [Disability Adjusted Life Years](https://en.wikipedia.org/wiki/Disability-adjusted_life_year)

## Affiliated Organizations

- [PolyBio](https://polybio.org/)
- [University of California, San Francisco](https://www.ucsf.edu/)

### Prerequisites

- Install Node (if you don't have it):
  https://nodejs.org/en/download

- Set up Git (if you haven't)
  https://docs.github.com/en/get-started/git-basics/set-up-git

## Setup

1. Fork the repository
   https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#forking-a-repository
2. Clone the repo to your local machine
   https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#cloning-your-forked-repository
3. (if you're going to contribute back to this repo) Add this repo as the "upstream"
   https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#configuring-git-to-sync-your-fork-with-the-upstream-repository

4. Install dependencies

   ```bash
     cd long-covid-dalys/
   ```

   ```bash
     npm install
   ```

5. **Preview:**

   ```bash
    npm run dev
   ```

   The site will be available at `http://localhost:5173`

## 📈 Data overview

- Data lives in `src/data/` directory
  - `DALYs.json` - Baseline DALY projections (main chart data)
- Configuration lives in `src/config`
  - `scenarios.ts` defines the various public health scenarios and their data structure

### Update DALYs

Format for `src/data/DALYS.json`:

```json
[
  {
    "year": 1,
    "baseline": 258,
    "HEPAMostCommonSpaces": 246,
    "HEPASchoolsAndDaycare": 233,
    "HEPAAllPublicIndoor": 162,
    "farUVCMostCommonSpaces": 240,
    "farUVCSchoolsAndDaycare": 226,
    "farUVCAllPublicIndoor": 131
  },
  {
    "year": 2,
    "baseline": 258,
    "HEPAMostCommonSpaces": 246,
    "HEPASchoolsAndDaycare": 233,
    "HEPAAllPublicIndoor": 162,
    "farUVCMostCommonSpaces": 240,
    "farUVCSchoolsAndDaycare": 226,
    "farUVCAllPublicIndoor": 131
  },
  ...
]
```

- `year`: number 1-10, for number of years of the projection
- `baseline`: baseline scenario, and each further scenario.
- numbers are the resultant DALYs

**To update:** Replace `src/data/DALYS.json` with your updated projections that match the above format. The chart will use the new data.

- Easiest method if you have write access to this repository: use the GitHub web interface to replace the `src/data/DALYS.json` file.

## Testing Your Changes (if working locally)

After updating data files:

1. **Development mode:** `npm run dev` - See changes immediately with hot reload
2. **Production build:** `npm run build` - Create optimized build for deployment
3. **Preview build:** `npm run preview` - Test the production build locally

## Deployment

After updating data files and verifying they work:

1. Commit your changes: `git add . && git commit -m "a message describing your changes, such as: Update DALY projections"`
2. Push to your repository: `git push`
3. Open a pull request against the "upstream" repo: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork
4. Once merged, the application will automatically rebuild and deploy to Netlify

## React + TypeScript + Vite

This project bootstrapped from the following Vite template: React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## Prior Art and Libraries Used

- UI components from [Shadcn](https://ui.shadcn.com/), [OriginUI](https://originui.com/)
- Charts built using [Recharts](https://recharts.org/en-US)
