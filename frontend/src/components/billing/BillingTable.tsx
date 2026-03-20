import { Download, CheckCircle2, Clock, XCircle, RefreshCcw } from "lucide-react";
import type { PaymentRecord, PaymentStatus } from "@/types/billing";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    className: "text-emerald-600 dark:text-emerald-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 dark:text-amber-400",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "text-red-600 dark:text-red-400",
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCcw,
    className: "text-gray-500 dark:text-gray-400",
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface BillingTableProps {
  records: PaymentRecord[];
  className?: string;
}

export const BillingTable = ({ records, className }: BillingTableProps) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
        No payment history yet.
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide pb-3 pr-6">
              Date
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide pb-3 pr-6">
              Description
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide pb-3 pr-6">
              Amount
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide pb-3 pr-6">
              Status
            </th>
            <th className="text-right text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide pb-3">
              Invoice
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
          {records.map((record) => {
            const cfg = STATUS_CONFIG[record.status];
            const Icon = cfg.icon;
            return (
              <tr key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                <td className="py-3.5 pr-6 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(record.date)}
                </td>
                <td className="py-3.5 pr-6 text-gray-900 dark:text-gray-100 font-medium">
                  {record.description}
                </td>
                <td className="py-3.5 pr-6 text-gray-900 dark:text-gray-100 font-semibold whitespace-nowrap">
                  {record.amount === 0 ? (
                    <span className="text-gray-400 dark:text-gray-600">—</span>
                  ) : (
                    `$${record.amount.toFixed(2)}`
                  )}
                </td>
                <td className="py-3.5 pr-6">
                  <span className={cn("inline-flex items-center gap-1.5 font-medium", cfg.className)}>
                    <Icon size={13} />
                    {cfg.label}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  {record.invoiceUrl ? (
                    <a
                      href={record.invoiceUrl}
                      className="inline-flex items-center gap-1 text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      <Download size={13} />
                      PDF
                    </a>
                  ) : (
                    <span className="text-gray-300 dark:text-gray-700 text-xs">N/A</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;
