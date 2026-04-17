import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import type { Group, Settlement, Expense } from "../store";

interface Props {
  group: Group | null;
  settlements: Settlement[];
  expenses: Expense[];
  currencySymbol: string;
  getMemberName: (groupId: string, memberId: string) => string;
}

export default function ResultPage({ group, settlements, expenses, currencySymbol, getMemberName }: Props) {
  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp size={28} className="text-primary" />
        </div>
        <p className="font-semibold text-base">No group selected</p>
        <p className="text-sm text-muted-foreground mt-1">Select a group from the Groups tab to see results</p>
      </div>
    );
  }

  const fmt = (n: number) => `${currencySymbol}${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = group.members.length > 0 ? total / group.members.length : 0;

  const memberPaid: Record<string, number> = {};
  group.members.forEach(m => { memberPaid[m.id] = 0; });
  expenses.forEach(e => {
    if (memberPaid[e.paidBy] !== undefined) memberPaid[e.paidBy] += e.amount;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-4 pt-3 pb-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{group.name} — Result</p>
      </div>

      {/* Summary card */}
      <div className="px-4 mb-3">
        <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-2xl p-4 text-white shadow-lg">
          <p className="text-xs font-medium opacity-75 mb-1">Total Expenses</p>
          <div className="flex items-baseline gap-0.5 mb-3">
            <span className="text-lg font-semibold opacity-80">{currencySymbol}</span>
            <span className="text-3xl font-bold">{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-70">Per person</p>
              <p className="text-sm font-bold">{fmt(perPerson)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Members</p>
              <p className="text-sm font-bold">{group.members.length}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Expenses</p>
              <p className="text-sm font-bold">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-person breakdown */}
      <div className="px-4 mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What each person paid</p>
        <div className="space-y-2">
          {group.members.map(m => {
            const paid = memberPaid[m.id] ?? 0;
            const diff = paid - perPerson;
            const isAhead = diff >= -0.005;
            return (
              <div key={m.id} className="flex items-center bg-card border border-border rounded-xl px-3 py-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-sm font-medium truncate">{m.name}</span>
                <div className="text-right">
                  <p className="text-sm font-bold">{fmt(paid)}</p>
                  <p className={`text-xs font-medium ${isAhead ? "text-primary" : "text-destructive"}`}>
                    {Math.abs(diff) < 0.005
                      ? "settled"
                      : isAhead
                        ? `+${fmt(diff)} ahead`
                        : `-${fmt(Math.abs(diff))} behind`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settlements */}
      <div className="px-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Who pays whom</p>
        {settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 bg-card border border-border rounded-2xl">
            <CheckCircle2 size={32} className="text-primary mb-2" />
            <p className="font-semibold text-sm text-primary">All settled up!</p>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length === 0 ? "No expenses added yet" : "Everyone owes the same amount"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {getMemberName(group.id, s.from).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 mx-3 min-w-0">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-semibold truncate max-w-[65px]">{getMemberName(group.id, s.from)}</span>
                    <ArrowRight size={13} className="text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold truncate max-w-[65px]">{getMemberName(group.id, s.to)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">needs to pay</p>
                </div>
                <p className="text-base font-bold text-primary flex-shrink-0">{fmt(s.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
