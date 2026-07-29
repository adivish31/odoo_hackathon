import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-hairline pb-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-ink flex items-center gap-3">
          {Icon && <Icon size={28} className="text-amber" strokeWidth={2} />}
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-ink-dim mt-2">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
