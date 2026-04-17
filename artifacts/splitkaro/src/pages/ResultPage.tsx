import { IndianRupee, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import type { Group, Settlement, Expense } from "../store";

interface Props {
  group: Group | null;
  settlements: Settlement[];
  expenses: Expense[];
  getMemberName: (groupId: string, memberId: string) => string;
}

export default function ResultPage({ group, settlements, expenses, getMemberName }: Props) {
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
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{group.name} — Result</span>
      </div>

      <div className="px-4 mb-3">
        <div className="bg-gradient-to-br from-primary to-purple-700 rounded-2xl p-4 text-white shadow-lg">
          <p className="text-xs font-medium opacity-80 mb-1">Total Expenses</p>
          <div className="flex items-baseline gap-1 mb-3">
            <IndianRupee size={20} className="mb-0.5" />
            <span className="text-3xl font-bold">{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-70">Per person</p>
              <p className="text-sm font-semibold">₹{perPerson.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Members</p>
              <p className="text-sm font-semibold">{group.members.length}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Expenses</p>
              <p className="text-sm font-semibold">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What each person paid</p>
        <div className="space-y-2">
          {group.members.map(m => {
            const paid = memberPaid[m.id] ?? 0;
            const diff = paid - perPerson;
            return (
              <div key={m.id} className="flex items-center bg-card border border-border rounded-xl px-3 py-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-sm font-medium">{m.name}</span>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{paid.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                  <p className={`text-xs font-medium ${diff >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {diff >= 0 ? `+₹${diff.toFixed(2)} ahead` : `-₹${Math.abs(diff).toFixed(2)} behind`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Who pays whom
        </p>
        {settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 bg-card border border-border rounded-2xl">
            <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
            <p className="font-semibold text-sm text-emerald-600">All settled up!</p>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length === 0 ? "No expenses added yet" : "Everyone owes the same amount"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {getMemberName(group.id, s.from).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 mx-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-semibold truncate max-w-[70px]">{getMemberName(group.id, s.from)}</span>
                    <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold truncate max-w-[70px]">{getMemberName(group.id, s.to)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">needs to pay</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-primary">
                    ₹{s.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
