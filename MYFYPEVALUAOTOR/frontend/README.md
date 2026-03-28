# 🎓 AI-Powered FYP Evaluator - Frontend

A modern React-based frontend for the AI-Powered FYP Evaluator system. Provides an intuitive interface for students to submit and evaluate their Final Year Project ideas.

## Features

✨ **Smart Idea Submission** - Submit FYP ideas with character counter
✨ **Real-time Similar Ideas Detection** - See similar ideas before submitting
✨ **Beautiful Results Dashboard** - Visual evaluation results with scores
✨ **Evaluation History** - Track all your past evaluations
✨ **Tailwind CSS** - Clean, modern, responsive design
✨ **No Authentication** - Works with browser localStorage for user tracking

## Tech Stack

- **Framework**: React 18.2
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Build Tool**: React Scripts / Webpack

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── HomePage.jsx        # Idea submission form
│   │   ├── HistoryPage.jsx     # Evaluation history view
│   │   └── UI.jsx              # Reusable UI components
│   ├── pages/
│   │   └── ResultsPage.jsx     # Results display page
│   ├── services/
│   │   ├── api.js              # Axios API wrapper
│   │   └── utils.js            # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── postcsss.config.js          # PostCSS configuration
├── tsconfig.json               # TypeScript config (optional)
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js 14+ and npm/yarn
- Backend running at http://localhost:8000

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

### 4. Start Development Server

```bash
npm start
```

App will open at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

Creates optimized build in `build/` folder.

## Pages & Components

### 🏠 HomePage

- Character-limited textarea for idea submission (50 char minimum)
- "Check Similar Ideas" button to preview existing similar ideas
- "Evaluate My Idea" button to submit
- Loading spinner during API call
- Error message display
- Similar ideas warning panel

**Key Features:**
- Real-time character counter
- Submit button disabled until 50 characters
- Shows related ideas found in database

### 📊 ResultsPage

Displays AI evaluation results including:

- **Overall Score** (0-10 with color coding)
- **Detailed Scores Cards**:
  - Uniqueness (0-10)
  - Technical Feasibility (0-10)
  - Problem-Solving Value (0-10)
- **Metadata**:
  - Domain classification
  - Complexity level (Low/Medium/High)
- **Strengths** (green section)
- **Weaknesses** (red section)
- **Improvement Suggestions** (blue section)
- **Action Buttons**:
  - Evaluate Another Idea
  - View My History

### 📚 HistoryPage

- Table of all user's evaluations
- Shows idea preview, score, domain, and date
- Click any row to view full evaluation details
- Modal popup with complete evaluation information
- Sortable by date (newest first)

**Features:**
- Idea text truncated in table view
- Click to expand and see full details
- All evaluation data displayed in modal
- Color-coded complexity badges

### 🔧 UI Components

**ProgressBar** - Visual progress indicator for scores
**ScoreCard** - Card showing score with progress bar
**Badge** - Colored label badges
**LoadingSpinner** - Animated spinner during loading
**ErrorMessage** - Red error alert box
**SuccessMessage** - Green success alert box

## User Flow

### New User (First Visit)

1. Browser generates random UUID → stored in localStorage
2. User types FYP idea (min 50 characters)
3. (Optional) Click "Check Similar Ideas" to see related ideas
4. Click "Evaluate My Idea"
5. API calls backend, displays results
6. User can click "View My History" to see all evaluations

### Returning User

1. Browser retrieves UUID from localStorage
2. Click "History" in navigation to see past evaluations
3. Click any evaluation to see full details
4. Can submit new ideas or review old ones

## API Integration

### apiService Methods

```javascript
// Evaluate a new idea
await apiService.evaluateIdea(ideaText, userId)

// Get user's history
await apiService.getHistory(userId)

// Find similar ideas
await apiService.findSimilarIdeas(ideaText)

// Get global stats
await apiService.getStats()

// Health check
await apiService.healthCheck()
```

## User ID Management

Users are identified by a UUID stored in localStorage:

```javascript
import { getUserId } from './services/utils';
const userId = getUserId();
// Auto-generates on first visit, reuses on return visits
```

## Styling

Using **Tailwind CSS** for styling:

- Responsive grid layouts
- Color-coded scores (green ≥ 8, blue 6-7, yellow 4-5, red < 4)
- Smooth transitions and animations
- Mobile-first design

## Development Tips

### Hot Reload

Changes auto-reload thanks to React Scripts. Just save files and browser updates.

### Environmental Variables

All env vars must start with `REACT_APP_` to be accessible:

```javascript
process.env.REACT_APP_API_URL
```

### Testing Components Locally

Create a `.env.local` file to override `.env` for local testing:

```
REACT_APP_API_URL=http://localhost:8000/api
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading of components
- Axios request/response caching
- Optimized re-renders with React hooks

## Troubleshooting

**"Cannot GET /api/evaluate"**
- Ensure backend is running at `http://localhost:8000`
- Check REACT_APP_API_URL in .env

**"CORS error in browser console"**
- Backend CORS middleware may need adjustment
- Backend default allows all origins for development

**"Evaluations not showing in History"**
- Check browser localStorage (DevTools → Application → localStorage)
- Verify user_id is persisted correctly
- Check backend for database issues

**npm start doesn't work**
- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again

## Production Deployment

### Building

```bash
npm run build
```

### Deployment Options

**Vercel**
```bash
vercel deploy
```

**Netlify**
```bash
netlify deploy --prod --dir=build
```

**Traditional Server (Apache/Nginx)**
- Copy `build/` contents to web root
- Configure server to serve `index.html` for all routes

### Environment Variables for Production

Create `.env.production`:

```
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Security Notes

⚠️ **Frontend runs in browser - all code is visible**
- Never put secrets in frontend code
- API keys should never be exposed
- CORS should be properly configured on backend
- Validate all user inputs

---

**Built with ❤️ for FYP success!**
