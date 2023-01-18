import clsx from "clsx";
import Link from "next/link";

const baseStyles: any = {
  solid:
    "inline-flex justify-center rounded-md py-2 px-4 text-base  font-semibold tracking-tight shadow-sm focus:outline-none",
  outline:
    "inline-flex justify-center rounded-md border py-2 px-[calc(theme(spacing.4)-1px)] text-base font-semibold tracking-tight focus:outline-none",
};

const variantStyles: any = {
  solid: {
    slate:
      "bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-slate-900",
    blue: "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-blue-600",
    white:
      "bg-white text-blue-600 hover:text-blue-700 focus-visible:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-blue-50 active:text-blue-900/80 disabled:opacity-40 disabled:hover:text-blue-600",
  },
  outline: {
    slate:
      "border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 active:border-slate-200 active:bg-slate-50 active:text-slate-900/70 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent",
    blue: "border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:text-blue-600/70 disabled:opacity-40 disabled:hover:border-blue-300 disabled:hover:bg-transparent",
    red: "bg-white border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:text-red-600/70 disabled:opacity-40 disabled:hover:border-red-300 disabled:hover:bg-transparent",
  },
};

export function Button({
  variant = "solid",
  color = "slate",
  className,
  href,
  ...props
}: any) {
  className = clsx(
    baseStyles[variant],
    variantStyles[variant][color],
    className
  );

  return href ? (
    <Link href={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  );
}
