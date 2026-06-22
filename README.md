[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/DevinCLane/long-covid-dalys)

[https://longcoviddalys.netlify.app/](https://longcoviddalys.netlify.app/)

# [Long Covid DALYs](https://longcoviddalys.netlify.app/)

An interactive data visualization tool that compares potential impact of population-level air cleaning interventions on Long COVID-related [disability-adjusted life years](https://en.wikipedia.org/wiki/Disability-adjusted_life_year).

## Affiliated Organizations

- [PolyBio](https://polybio.org/)
- [University of California, San Francisco](https://www.ucsf.edu/)

## Tech stack

- React
- TypeScript
- [Recharts](https://recharts.org/en-US) (React and [D3](https://d3js.org/)) for the charts
- [Shadcn](https://ui.shadcn.com/), [OriginUI](https://originui.com/) for UI components

## Tech stack

| Area                 | Technology                          | Usage                                                                                                               |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Application          | React 19, TypeScript 6              | Component architecture, state management, and strict type checking                                                  |
| Build tooling        | Vite 7                              | Local development, optimized production builds, and hot module replacement                                          |
| Visualization        | Recharts 3                          | Responsive stacked bar and area-chart visualizations                                                                |
| UI and accessibility | Tailwind CSS 4, shadcn, OriginUI    | Accessibiliy, keyboard navigation, responsive design                                                                |
| Data pipeline        | Versioned JSON datasets             | Reading flat JSON files removes need for a server. Keeps presentation logic separate from data model implementation |
| Code quality         | ESLint, Prettier, strict TypeScript | Static analysis and consistent formatting                                                                           |
| Deployment           | Netlify                             | Automated builds and pull-request deploy previews                                                                   |

## Contributing / Running this project locally

### Prerequisites

- Node installed:
  https://nodejs.org/en/download

- Git set up:
  https://docs.github.com/en/get-started/git-basics/set-up-git

### Setup

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

### 📈 Data overview

- Data lives in `src/data/` directory
  - the 4 charts read from `src/data/data.json`

#### Update Data

Format for `src/data/data.json`:

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

A few explanations of the data fields:

- scenarios => label: the intervention scenario you're modeling (e.g., putting HEPA filters in buildings)
- scenarios => conditions => condition: the outcome health condition for which DALYs are calculated (Long COVID, PASC, and acute COVID in this case)

**To update:** Replace `src/data/data.json` with your updated projections that match same data structure. The chart will use the new data.

- Easiest method: use the GitHub web interface to replace the `src/data/data.json` file.
  - to do this, click through to the DALYs file [here](https://github.com/DevinCLane/long-covid-dalys/blob/main/src/data/data.json) and then click [edit](https://github.com/DevinCLane/long-covid-dalys/edit/main/src/data/data.json)
  - once you've updated the file, and the formatting matches, click "Commit changes".
  - Write a description of what you've changed
  - You can click "Commit directly to the main branch". For increased safety to check if your changes work, click "Create a new branch for this commit and start a pull request".
    - Find the [Pull Requests page](https://github.com/DevinCLane/long-covid-dalys/pulls), and you will see that Netlify has created a deploy preview where you can view what your changes look like, and make sure that everything works. Then you will have to merge that pull request for it to deploy the new site on the main domain. You'll likely see a button that says "merge pull request".

### Testing Your Changes (if working locally)

After updating data files:

1. **Development mode:** `npm run dev` - See changes immediately with hot reload
2. **Production build:** `npm run build` - Create optimized build for deployment. Not required to do if using Netlify from this repository. This step might be needed if you'd like to see what the built site looks like locally. Or you would need this step if you are going to send a zipped file of all the code over to someone who is managing a server where you'd like to deploy the site.
3. **Preview build:** `npm run preview` - Test the production build locally (not required to do)

### Deployment

After updating data files and verifying they work:

1. Commit your changes: `git add . && git commit -m "a message describing your changes, such as: Update DALY projections"`
2. Push to your repository: `git push`
3. Open a pull request against the "upstream" repo: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork
4. Once merged, the application will automatically rebuild and deploy to Netlify
