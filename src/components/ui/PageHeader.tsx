import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  titleStyle?: "default" | "serif";
}

export function PageHeader({ title, description, action, titleStyle = "default" }: PageHeaderProps) {
  const titleClass = titleStyle === "serif" ? "font-serif text-4xl font-normal tracking-normal text-ink sm:text-5xl" : "text-2xl font-semibold tracking-normal text-ink";

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className={titleClass}>{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-ink/60">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
