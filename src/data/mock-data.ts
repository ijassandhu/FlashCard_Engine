import {
  BarChart3,
  BookMarked,
  Brain,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  LineChart,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";

export const productFlow = [
  {
    title: "Upload PDF",
    description: "Start with lecture notes, textbook chapters, or a course handout.",
    icon: UploadCloud,
  },
  {
    title: "Generate deck",
    description: "Extract concepts, formulas, examples, and likely exam prompts.",
    icon: Sparkles,
  },
  {
    title: "Review smartly",
    description: "Practice with a spaced repetition loop tuned for comprehension.",
    icon: Brain,
  },
  {
    title: "Track mastery",
    description: "See which topics are stable and which still need another pass.",
    icon: LineChart,
  },
];

export const trustFeatures = [
  "Built for dense academic PDFs",
  "Concept-first flashcard structure",
  "Designed for spaced repetition",
  "Progress signals without clutter",
];

export const sampleDocuments = [
  "Calculus lecture notes",
  "Biology chapter summary",
  "Case law reading",
  "Chemistry formula sheet",
];

export const generationSteps = [
  "Parse the source document into clean learning sections.",
  "Identify definitions, processes, formulas, and weak-context cues.",
  "Draft question and answer cards with topic tags.",
  "Prepare the deck for review and mastery tracking.",
];

export const deck = {
  title: "Quadratic Equations",
  source: "Algebra II - Chapter 4.pdf",
  updatedAt: "Updated 2 hours ago",
  totalCards: 84,
  mastered: 51,
  dueToday: 18,
  mastery: 61,
  weakTopics: ["Factoring forms", "Completing the square", "Discriminant cases"],
  topicClusters: [
    { name: "Standard form", cards: 18, mastery: 76 },
    { name: "Factoring", cards: 22, mastery: 54 },
    { name: "Quadratic formula", cards: 20, mastery: 68 },
    { name: "Graph interpretation", cards: 14, mastery: 49 },
    { name: "Word problems", cards: 10, mastery: 42 },
  ],
  cardTypes: [
    { label: "Concept", count: 30 },
    { label: "Worked example", count: 24 },
    { label: "Formula", count: 16 },
    { label: "Application", count: 14 },
  ],
  activity: [
    "Reviewed 16 cards from Factoring",
    "Marked 5 cards as mastered",
    "Added weak-topic flag to Discriminant cases",
  ],
};

export const flashcards = [
  {
    question: "What does the discriminant tell you about a quadratic equation?",
    answer:
      "The discriminant, b^2 - 4ac, indicates how many real solutions the equation has and whether the roots are repeated or distinct.",
    topic: "Discriminant cases",
    type: "Concept",
  },
  {
    question: "When is completing the square preferable to factoring?",
    answer:
      "Use completing the square when a quadratic does not factor cleanly or when you need vertex form for graph interpretation.",
    topic: "Completing the square",
    type: "Strategy",
  },
  {
    question: "Convert x^2 + 6x + 5 into factored form.",
    answer: "(x + 1)(x + 5), because the factors sum to 6 and multiply to 5.",
    topic: "Factoring forms",
    type: "Worked example",
  },
  {
    question: "What is the axis of symmetry for y = ax^2 + bx + c?",
    answer: "x = -b / 2a. It passes through the vertex of the parabola.",
    topic: "Graph interpretation",
    type: "Formula",
  },
];

export const libraryDecks = [
  {
    title: "Quadratic Equations",
    source: "Algebra II - Chapter 4.pdf",
    cards: 84,
    due: 18,
    mastery: 61,
    updated: "2h ago",
    status: "Due today",
  },
  {
    title: "Cellular Respiration",
    source: "Biology Unit 3 Notes.pdf",
    cards: 112,
    due: 9,
    mastery: 74,
    updated: "Yesterday",
    status: "In progress",
  },
  {
    title: "Contract Formation",
    source: "Business Law Reading Pack.pdf",
    cards: 67,
    due: 0,
    mastery: 88,
    updated: "Mar 18",
    status: "Stable",
  },
  {
    title: "Organic Chemistry Mechanisms",
    source: "Reaction Guide.pdf",
    cards: 96,
    due: 24,
    mastery: 46,
    updated: "Apr 14",
    status: "Needs review",
  },
];

export const statCards = [
  { label: "Total cards", value: "84", detail: "Across 5 topic clusters", icon: Layers3 },
  { label: "Mastered", value: "51", detail: "61% current mastery", icon: CheckCircle2 },
  { label: "Due today", value: "18", detail: "Estimated 14 minute session", icon: Clock3 },
  { label: "Weak topics", value: "3", detail: "Prioritized for review", icon: Target },
];

export const libraryStats = [
  { label: "Active decks", value: "4", detail: "3 recently reviewed", icon: BookMarked },
  { label: "Due cards", value: "51", detail: "Across your current decks", icon: Clock3 },
  { label: "Average mastery", value: "67%", detail: "Up 8% this week", icon: BarChart3 },
  { label: "Sources", value: "4", detail: "PDF imports ready to expand", icon: FileText },
];
