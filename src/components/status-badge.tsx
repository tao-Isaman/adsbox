const statusStyles: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  matched:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  printing:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const statusLabels: Record<string, string> = {
  pending: "รอดำเนินการ",
  confirmed: "ยืนยันแล้ว",
  matched: "จับคู่แล้ว",
  printing: "กำลังพิมพ์",
  completed: "เสร็จสิ้น",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusStyles[status] ?? "bg-zinc-100 text-zinc-800"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
