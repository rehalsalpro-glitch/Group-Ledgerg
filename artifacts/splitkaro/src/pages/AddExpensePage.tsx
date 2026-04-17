import { useState } from "react";
import { IndianRupee, Receipt } from "lucide-react";
import type { Group, Expense } from "../store";

interface Props {
  group: Group | null;
  expenses: Expense[];
  onAdd: (title: string, amount: number, paidBy: string) => void;
  onDelete: (id: string) => void;
  getMemberName: (groupId: string, memberId: string) => string;
}

export default function AddExpensePage({ group, expenses, onAdd, onDelete, getMemberName }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(group?.members[0]?.id ?? "");

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Receipt size={28} className="text-primary" />
        </div>
        <p className="font-semibold text-base">No group selected</p>
        <p className="text-sm text-muted-foreground mt-1">Go to Groups tab and select or create a group first</p>
      </div>
    );
  }

  function handleAdd() {
    if (!title.trim() || !amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    if (!paidBy) return;
    onAdd(title.trim(), Number(amount), paidBy);
    setTitle("");
    setAmount("");
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = group.members.length > 0 ? total / group.members.length : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{group.name}</span>
          <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
            <IndianRupee size={11} />
            <span>{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
            <span className="text-primary/60 font-medium">total</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Split among {group.members.length} · Each pays ₹{perPerson.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </p>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-sm font-semibold mb-3">Add Expense</p>
          <input
            className="w-full border border-border rounded-xl px-3 py-2 text-sm mb-2 bg-background outline-none focus:ring-2 focus:ring-primary"
            placeholder="What's this for? (e.g. Dinner)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
            <input
              type="number"
              inputMode="decimal"
              className="w-full border border-border rounded-xl pl-7 pr-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Paid by</label>
            <div className="flex flex-wrap gap-2">
              {group.members.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaidBy(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    paidBy === m.id
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!title.trim() || !amount || Number(amount) <= 0 || !paidBy}
            className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
          >
            Add Expense
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Expenses ({expenses.length})
        </p>
        {expenses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No expenses yet. Add one above.
          </div>
        )}
        <div className="space-y-2">
          {expenses.map(exp => (
            <div key={exp.id} className="flex items-center bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center mr-3 flex-shrink-0">
                <IndianRupee size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{exp.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Paid by {getMemberName(exp.groupId, exp.paidBy)}
                </p>
              </div>
              <div className="text-right ml-2">
                <p className="text-sm font-bold text-primary">
                  ₹{exp.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="text-xs text-destructive mt-0.5 font-medium active:scale-95 transition-transform"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
