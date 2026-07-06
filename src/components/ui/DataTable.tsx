import { ReactNode } from "react";

interface DataTableProps<T> {
  columns: Array<{ header: string; cell: (row: T) => ReactNode; className?: string }>;
  data: T[];
  getKey: (row: T) => string | number;
}

export function DataTable<T>({ columns, data, getKey }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink/10 text-sm">
          <thead className="bg-mist">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-ink/55 ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {data.map((row) => (
              <tr key={getKey(row)} className="hover:bg-mist/70">
                {columns.map((column) => (
                  <td key={column.header} className={`whitespace-nowrap px-4 py-3 text-ink/75 ${column.className ?? ""}`}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
