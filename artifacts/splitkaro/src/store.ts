import { useState, useEffect } from "react";

export interface Member {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  createdAt: number;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  createdAt: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useStore() {
  const [groups, setGroups] = useState<Group[]>(() => load("sk_groups", []));
  const [expenses, setExpenses] = useState<Expense[]>(() => load("sk_expenses", []));
  const [activeGroupId, setActiveGroupId] = useState<string | null>(() => {
    const gs: Group[] = load("sk_groups", []);
    return gs.length > 0 ? gs[0].id : null;
  });

  useEffect(() => { save("sk_groups", groups); }, [groups]);
  useEffect(() => { save("sk_expenses", expenses); }, [expenses]);

  const activeGroup = groups.find(g => g.id === activeGroupId) ?? null;

  function createGroup(name: string, memberNames: string[]) {
    const members: Member[] = memberNames.filter(n => n.trim()).map(n => ({ id: uid(), name: n.trim() }));
    const group: Group = { id: uid(), name, members, createdAt: Date.now() };
    setGroups(prev => [group, ...prev]);
    setActiveGroupId(group.id);
    return group;
  }

  function updateGroup(id: string, name: string, memberNames: string[]) {
    setGroups(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newMembers: Member[] = memberNames.filter(n => n.trim()).map(n => {
        const existing = g.members.find(m => m.name.toLowerCase() === n.trim().toLowerCase());
        return existing ?? { id: uid(), name: n.trim() };
      });
      return { ...g, name: name.trim(), members: newMembers };
    }));
  }

  function deleteGroup(id: string) {
    setGroups(prev => prev.filter(g => g.id !== id));
    setExpenses(prev => prev.filter(e => e.groupId !== id));
    setActiveGroupId(prev => prev === id ? null : prev);
  }

  function addExpense(groupId: string, title: string, amount: number, paidBy: string) {
    const expense: Expense = { id: uid(), groupId, title, amount, paidBy, createdAt: Date.now() };
    setExpenses(prev => [expense, ...prev]);
  }

  function deleteExpense(id: string) {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  function getGroupExpenses(groupId: string) {
    return expenses.filter(e => e.groupId === groupId);
  }

  function calculateSettlements(groupId: string): Settlement[] {
    const group = groups.find(g => g.id === groupId);
    if (!group || group.members.length === 0) return [];
    const exps = getGroupExpenses(groupId);
    if (exps.length === 0) return [];

    const balances: Record<string, number> = {};
    group.members.forEach(m => { balances[m.id] = 0; });

    const perPerson = 1 / group.members.length;

    exps.forEach(exp => {
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
      }
      group.members.forEach(m => {
        balances[m.id] -= exp.amount * perPerson;
      });
    });

    const creditors: Array<{ id: string; amount: number }> = [];
    const debtors: Array<{ id: string; amount: number }> = [];

    Object.entries(balances).forEach(([id, bal]) => {
      if (bal > 0.005) creditors.push({ id, amount: bal });
      else if (bal < -0.005) debtors.push({ id, amount: -bal });
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements: Settlement[] = [];
    let ci = 0, di = 0;
    while (ci < creditors.length && di < debtors.length) {
      const c = creditors[ci];
      const d = debtors[di];
      const amt = Math.min(c.amount, d.amount);
      settlements.push({ from: d.id, to: c.id, amount: Math.round(amt * 100) / 100 });
      c.amount -= amt;
      d.amount -= amt;
      if (c.amount < 0.005) ci++;
      if (d.amount < 0.005) di++;
    }

    return settlements;
  }

  function getMemberName(groupId: string, memberId: string) {
    const group = groups.find(g => g.id === groupId);
    return group?.members.find(m => m.id === memberId)?.name ?? "Unknown";
  }

  function generateShareText(groupId: string): string {
    const group = groups.find(g => g.id === groupId);
    if (!group) return "";
    const exps = getGroupExpenses(groupId);
    const total = exps.reduce((s, e) => s + e.amount, 0);
    const perPerson = group.members.length > 0 ? total / group.members.length : 0;

    let text = `*${group.name} – Expense Summary*\n`;
    text += `Members: ${group.members.map(m => m.name).join(", ")}\n\n`;
    text += `*Total:* ₹${total.toFixed(2)}\n`;
    text += `*Per person:* ₹${perPerson.toFixed(2)}\n`;

    if (exps.length > 0) {
      text += `\n*Expenses:*\n`;
      exps.forEach(e => {
        const payer = group.members.find(m => m.id === e.paidBy)?.name ?? "Unknown";
        text += `• ${e.title}: ₹${e.amount.toFixed(2)} (paid by ${payer})\n`;
      });
    }

    const settlements = calculateSettlements(groupId);
    if (settlements.length > 0) {
      text += `\n*Who pays whom:*\n`;
      settlements.forEach(s => {
        const from = group.members.find(m => m.id === s.from)?.name ?? "Unknown";
        const to = group.members.find(m => m.id === s.to)?.name ?? "Unknown";
        text += `• ${from} → ${to}: ₹${s.amount.toFixed(2)}\n`;
      });
    } else {
      text += `\n✅ All settled up!\n`;
    }

    text += `\n_Shared via SplitKaro_`;
    return text;
  }

  return {
    groups,
    expenses,
    activeGroupId,
    activeGroup,
    setActiveGroupId,
    createGroup,
    updateGroup,
    deleteGroup,
    addExpense,
    deleteExpense,
    getGroupExpenses,
    calculateSettlements,
    getMemberName,
    generateShareText,
  };
}
