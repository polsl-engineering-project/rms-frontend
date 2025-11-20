import type { Package } from '@repo/ui';

interface EmptyStateProps {
  icon: typeof Package;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="w-16 h-16 text-gray-400 mb-4" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-sm">{description}</p>
    </div>
  );
}
