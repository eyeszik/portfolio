import * as React from "react";
import clsx from "clsx";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={clsx("rounded-xl border border-zinc-800 bg-zinc-950/40", props.className)} />;
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={clsx("p-5 border-b border-zinc-800", props.className)} />;
}

export function CardBody(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={clsx("p-5", props.className)} />;
}

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={clsx("text-sm text-zinc-300", props.className)} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100",
        "outline-none focus:ring-2 focus:ring-zinc-700",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        "w-full min-h-[96px] rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100",
        "outline-none focus:ring-2 focus:ring-zinc-700",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100",
        "outline-none focus:ring-2 focus:ring-zinc-700",
        props.className
      )}
    />
  );
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
) {
  const v = props.variant ?? "primary";
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        v === "primary"
          ? "bg-zinc-100 text-zinc-950 hover:bg-white"
          : "bg-transparent text-zinc-100 border border-zinc-800 hover:bg-zinc-900",
        props.className
      )}
    />
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-300">{children}</span>;
}

export function Divider() {
  return <div className="my-4 h-px bg-zinc-800" />;
}
