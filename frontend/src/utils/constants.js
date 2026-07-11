// ─── utils/constants.js ───────────────────────────────────────────────────────
// Application-wide constants shared across pages and components.
// ─────────────────────────────────────────────────────────────────────────────

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const TABS = [
  'AI Verdict',
  'Past',
  'Present',
  'Future',
  'Related Companies',
];

export const LOADING_STEPS = [
  'Resolving company identity...',
  'Fetching Yahoo Finance data...',
  'Analyzing financial statements...',
  'Running Gemini AI analysis...',
  'Building investment verdict...',
  'Finalising research report...',
];

export const VERDICT_COLORS = {
  INVEST: '#3FBE72',
  WAIT:   '#F2C230',
  SKIP:   '#E5544D',
};
