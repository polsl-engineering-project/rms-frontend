export const SPICE_LEVELS = {
  NONE: 'NONE',
  MILD: 'MILD',
  MEDIUM: 'MEDIUM',
  HOT: 'HOT',
  EXTRA_HOT: 'EXTRA_HOT',
} as const;

export type SpiceLevel = ValueOf<typeof SPICE_LEVELS>;

export const SPICE_LEVEL_LABELS: Record<SpiceLevel, string> = {
  NONE: 'Not Spicy 🍃',
  MILD: 'Mild 🌶️',
  MEDIUM: 'Medium 🌶️🌶️',
  HOT: 'Hot 🌶️🌶️🌶️',
  EXTRA_HOT: 'Extra Hot 🌶️🌶️🌶️🌶️',
};

export const SPICE_LEVEL_COLORS: Record<SpiceLevel, string> = {
  NONE: 'bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800',
  MILD: 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800',
  HOT: 'bg-orange-100 text-orange-800 hover:bg-orange-100 hover:text-orange-800',
  EXTRA_HOT: 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800',
};

export const DIETARY_BADGES = [
  {
    key: 'vegetarian' as const,
    label: 'Vegetarian',
    icon: '🥗',
    color: 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800',
  },
  {
    key: 'vegan' as const,
    label: 'Vegan',
    icon: '🌱',
    color: 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800',
  },
  {
    key: 'glutenFree' as const,
    label: 'Gluten Free',
    icon: '🌾',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800',
  },
] as const;
