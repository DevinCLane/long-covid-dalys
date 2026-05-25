[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/DevinCLane/long-covid-dalys)

# Long Covid DALYs

A research project to explore how different public health interventions could improve or worsen the burden of long covid, post-acute sequelae of COVID-19 (PASC), and acute COVID, as measured in [Disability Adjusted Life Years](https://en.wikipedia.org/wiki/Disability-adjusted_life_year)

## Affiliated Organizations

- [PolyBio](https://polybio.org/)
- [University of California, San Francisco](https://www.ucsf.edu/)

### Prerequisites

- Node installed:
  https://nodejs.org/en/download

- Git set up:
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
  - chart is currently reading from `src/data/results_detailed_age39_10yr_adjusted.json` (to update this to a simpler title once data is finalized)

### Update Data

**To update:** Replace `src/data/results_detailed_age39_10yr_adjusted.json` with your updated projections that match the above format. The chart will use the new data.

- Easiest method: use the GitHub web interface to replace the `src/data/results_detailed_age39_10yr_adjusted.json` file.
  - to do this, click through to the DALYs file [here](https://github.com/DevinCLane/long-covid-dalys/blob/main/src/data/results_detailed_age39_10yr_adjusted.json) and then click [edit](https://github.com/DevinCLane/long-covid-dalys/edit/main/src/data/results_detailed_age39_10yr_adjusted.json)
  - once you've updated the file, and the formatting matches, click "Commit changes".
  - Write a description of what you've changed
  - You can click "Commit directly to the main branch". For increased safety to check if your changes work, click "Create a new branch for this commit and start a pull request". Then you will view the pull request and Netlify will reploy a deploy preview where you can view what your changes look like. Then you will have to merge that pull request for it to deploy the new site on the main domain.

Format for `src/data/DALYS.json`:

```json
{
  "generated_at": "2026-05-14",
  "parameters_used": {
    "label": "Acute COVID",
    "model_type": "acute",
    "default_horizon": 10,
    "disability_weight": 0.015493,
    "case_fatality_rate": 0.000576,
    "condition": "acute_covid",
    "horizon": 10,
    "age0": 35,
    "annual_infection_rate": 0.2263
  },
  "scenarios": [
    {
      "id": "baseline",
      "label": "Baseline",
      "dalys_per_1000_total": 279,
      "conditions": [
        {
          "condition": "acute_covid",
          "label": "Acute COVID",
          "annual_infection_rate": 0.2874,
          "totals": {
            "daly": 0.049,
            "dalys_per_1000": 49
          },
          "years": [
            {
              "year": 1,
              "age": 35,
              "yld": 0.00350431,
              "yll": 0.00706823,
              "daly": 0.01057254,
              "dalys_per_1000": 10.57254139,
              "dalys_total_population": 10.57254139,
              "annual_infection_rate": 0.2263,
              "background_mortality_rate": 0.00190591,
              "onset_rate": null
            },
            {
              "year": 2,
              "age": 36,
              "yld": 0.00350081,
              "yll": 0.0069327,
              "daly": 0.01043351,
              "dalys_per_1000": 10.43350697,
              "dalys_total_population": 10.43350697,
              "annual_infection_rate": 0.2263,
              "background_mortality_rate": 0.00198466,
              "onset_rate": null
            },
          ]
        },
        {
          "condition": "long_covid",
          "label": "Long COVID",
          "annual_infection_rate": 0.2874,
          "totals": {
            "daly": 0.083,
            "dalys_per_1000": 83
          },
          "years": []
        },
        {
          "condition": "pasc",
          "label": "PASC",
          "annual_infection_rate": 0.2874,
          "totals": {
            "daly": 0.147,
            "dalys_per_1000": 147
          },
          "years": []
        }
      ]
    },
    {
      "id": "hepa_most_public",
      "label": "HEPA in most common indoor air",
      "dalys_per_1000_total": 261,
      "conditions": [
        {
          "condition": "acute_covid",
          "label": "Acute COVID",
          "annual_infection_rate": 0.2874,
          "totals": {
            "daly": 0.045,
            "dalys_per_1000": 45
          },
          "years": []
        },
        {
          "condition": "long_covid",
          "label": "Long COVID",
          "annual_infection_rate": 0.2874,
          "totals": {
            "daly": 0.08,
            "dalys_per_1000": 80
          },
          "years": []
        },
        {
          "condition": "pasc",
          "label": "PASC",
          "annual_infection_rate": 0.2874,
          "totals": {
            "daly": 0.135,
            "dalys_per_1000": 135
          },
          "years": []
        }
      ]
    },
```

- scenarios => label: the intervention scenario you're modeling (e.g., putting HEPA filters in buildings)
- scenarios => conditions => condition: the outcome health condition for which DALYs are calculated (Long COVID, PASC, and acute COVID in this case)

## Testing Your Changes (if working locally)

After updating data files:

1. **Development mode:** `npm run dev` - See changes immediately with hot reload
2. **Production build:** `npm run build` - Create optimized build for deployment (not required to do)
3. **Preview build:** `npm run preview` - Test the production build locally (not required to do)

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
