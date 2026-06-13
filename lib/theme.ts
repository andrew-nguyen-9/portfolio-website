// Design direction: "Modern analytics engineer meets Kyoto listening bar"
// Vinyl records, houseplants, walnut wood, ambient lighting

export const theme = {
  dark: {
    background: "#222B28", // Deep evergreen
    surface:    "#313833", // Graphite moss
    primary:    "#A8B8A1", // Eucalyptus sage
    secondary:  "#D06D43", // Persimmon orange
    highlight:  "#E2BE6D", // Warm brass
    text:       "#F8F4EB", // Rice paper
  },
  light: {
    background: "#F8F4EB", // Rice paper
    surface:    "#E6D9C7", // Cedar cream
    primary:    "#506354", // Forest sage
    secondary:  "#B85A30", // Burnt persimmon
    highlight:  "#A47C2F", // Antique brass
    text:       "#2A2A2A", // Soft charcoal
  },
  loader: {
    background: "#222B28",
    groove:     "#A8B8A1",
    label:      "#313833",
    monogram:   "#F8F4EB",
    lamp:       "#E2BE6D",
    plant:      "#506354",
    accent:     "#D06D43",
  },
} as const;

export type Theme = typeof theme;
