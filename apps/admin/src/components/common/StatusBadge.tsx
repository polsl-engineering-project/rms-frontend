import { Badge } from '@repo/ui';
import { LucideIcon } from 'lucide-react';
import { cn } from '@repo/ui';

export type StatusConfig = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon?: LucideIcon;
  className?: string;
};

interface StatusBadgeProps {
  status: string;
  config: Record<string, StatusConfig>;
  className?: string;
}

export function StatusBadge({ status, config, className }: StatusBadgeProps) {
  const statusConfig = config[status];

  if (!statusConfig) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    );
  }

  const { label, variant, icon: Icon, className: configClassName } = statusConfig;

  return (
    <Badge
      variant={variant}
      className={cn('flex w-fit items-center gap-1', configClassName, className)}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span>{label}</span>
    </Badge>
  );
}
