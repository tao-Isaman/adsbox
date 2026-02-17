"use client";

import { useState, useTransition } from "react";
import {
  createMatchGroup,
  updateMatchGroupStatus,
} from "@/app/actions/matching";
import { StatusBadge } from "@/components/status-badge";

interface UnmatchedOrder {
  id: string;
  created_at: string;
  profiles: { customer_name: string | null; company_name: string | null };
  packages: { name: string; box_amount: number; price: number };
}

interface MatchGroupData {
  id: string;
  name: string;
  status: string;
  packages: { name: string; box_amount: number };
  match_group_members: {
    id: string;
    orders: {
      id: string;
      profiles: { customer_name: string | null; company_name: string | null };
      poster_url: string | null;
    };
  }[];
}

export function MatchingInterface({
  unmatchedOrders,
  matchGroups,
}: {
  unmatchedOrders: UnmatchedOrder[];
  matchGroups: MatchGroupData[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isPending, startTransition] = useTransition();

  const ordersByPackage = unmatchedOrders.reduce(
    (acc, order) => {
      const pkgName = order.packages.name;
      if (!acc[pkgName]) acc[pkgName] = [];
      acc[pkgName].push(order);
      return acc;
    },
    {} as Record<string, UnmatchedOrder[]>
  );

  const toggleOrder = (orderId: string) => {
    setSelected((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : prev.length < 4
          ? [...prev, orderId]
          : prev
    );
  };

  const getSelectedPackageName = (): string | null => {
    if (selected.length === 0) return null;
    return (
      unmatchedOrders.find((o) => o.id === selected[0])?.packages.name ?? null
    );
  };

  const handleCreateGroup = () => {
    if (selected.length !== 4 || !groupName.trim()) return;

    startTransition(async () => {
      const result = await createMatchGroup(groupName.trim(), selected);
      if (!result?.error) {
        setSelected([]);
        setGroupName("");
      }
    });
  };

  const handleStatusUpdate = (groupId: string, status: string) => {
    startTransition(() => {
      updateMatchGroupStatus(groupId, status);
    });
  };

  const selectedPkgName = getSelectedPackageName();

  return (
    <div className="space-y-8">
      {/* ออเดอร์ที่ยังไม่ได้จับคู่ */}
      <section>
        <h2 className="text-lg font-semibold">
          ออเดอร์ที่ยืนยันแล้ว (พร้อมจับคู่)
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          เลือกออเดอร์ 4 รายการจากแพ็กเกจเดียวกันเพื่อสร้างกลุ่มจับคู่
        </p>

        {Object.keys(ordersByPackage).length === 0 && (
          <p className="mt-4 text-sm text-zinc-400">
            ไม่มีออเดอร์ที่พร้อมจับคู่ในขณะนี้
          </p>
        )}

        {Object.entries(ordersByPackage).map(([pkgName, orders]) => (
          <div key={pkgName} className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {pkgName} ({orders.length} ออเดอร์)
            </h3>
            <div className="space-y-2">
              {orders.map((order) => {
                const isSelected = selected.includes(order.id);
                const isDisabled =
                  (!isSelected && selected.length >= 4) ||
                  (selectedPkgName !== null &&
                    selectedPkgName !== pkgName &&
                    !isSelected);

                return (
                  <label
                    key={order.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : isDisabled
                          ? "cursor-not-allowed border-zinc-100 opacity-50 dark:border-zinc-800"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleOrder(order.id)}
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {order.profiles.customer_name ?? "ไม่ทราบชื่อ"}
                      </span>
                      {order.profiles.company_name && (
                        <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                          ({order.profiles.company_name})
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400">
                      {new Date(order.created_at).toLocaleDateString("th-TH")}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* ฟอร์มสร้างกลุ่ม */}
        {selected.length > 0 && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium">
              เลือกแล้ว: {selected.length}/4 ออเดอร์
              {selectedPkgName && ` - ${selectedPkgName}`}
            </p>
            {selected.length === 4 && (
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="ชื่อกลุ่ม..."
                  className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
                <button
                  onClick={handleCreateGroup}
                  disabled={isPending || !groupName.trim()}
                  className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {isPending ? "กำลังสร้าง..." : "สร้างกลุ่ม"}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* กลุ่มที่จับคู่แล้ว */}
      <section>
        <h2 className="text-lg font-semibold">กลุ่มจับคู่</h2>
        {matchGroups.length === 0 && (
          <p className="mt-2 text-sm text-zinc-400">
            ยังไม่มีกลุ่มจับคู่
          </p>
        )}
        <div className="mt-4 space-y-4">
          {matchGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {group.packages.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={group.status} />
                  {group.status === "pending" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(group.id, "printing")
                      }
                      disabled={isPending}
                      className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                    >
                      เริ่มพิมพ์
                    </button>
                  )}
                  {group.status === "printing" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(group.id, "completed")
                      }
                      disabled={isPending}
                      className="rounded-md bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-600 disabled:opacity-50"
                    >
                      เสร็จสิ้น
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {group.match_group_members.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-md bg-zinc-50 p-2 text-sm dark:bg-zinc-800"
                  >
                    <p className="font-medium">
                      {member.orders.profiles.customer_name ?? "ไม่ทราบชื่อ"}
                    </p>
                    {member.orders.profiles.company_name && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {member.orders.profiles.company_name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
