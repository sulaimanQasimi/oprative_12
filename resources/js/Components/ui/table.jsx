import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm border-collapse bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700", className)}
      {...props}
    />
  </div>
));

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-slate-50 dark:bg-slate-900/50", className)} {...props} />
));

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-slate-200 dark:divide-slate-700", className)}
    {...props}
  />
));

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-slate-50 font-medium dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700", className)}
    {...props}
  />
));

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 last:border-b-0",
      className
    )}
    {...props}
  />
));

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-14 px-6 py-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 [&:has([role=checkbox])]:pr-0 text-sm uppercase tracking-wide",
      className
    )}
    {...props}
  />
));

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-6 py-4 align-middle text-slate-800 dark:text-slate-200 [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));

const TableCaption = forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-slate-600 dark:text-slate-400 text-center", className)}
    {...props}
  />
));

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
