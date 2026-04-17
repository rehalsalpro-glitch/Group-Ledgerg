import { useState } from "react";
import { PlusCircle, Users, TrendingUp, Settings } from "lucide-react";
import { useStore } from "./store";
import GroupsPage from "./pages/GroupsPage";
import AddExpensePage from "./pages/AddExpensePage";
import ResultPage from "./pages/ResultPage";

type Tab = "add" | "groups" | "result";

export default function App() {
  const [tab, setTab] = useState<Tab>("groups");
  const [showSettings, setShowSettings] = useState(false);

  const store = useStore();
  const groupExpenses = store.activeGroup
    ? store.getGroupExpenses(store.activeGroup.id)
    : [];
  const settlements = store.activeGroup
    ? store.calculateSettlements(store.activeGroup.id)
    : [];

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-background relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-border shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-black">S</span>
          </div>
          <div>
            <h1 className="text-base font-black text-foreground leading-tight">SplitKaro</h1>
            {store.activeGroup && (
              <p className="text-xs text-muted-foreground leading-tight">{store.activeGroup.name}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-90 transition-transform"
        >
          <Settings size={16} className="text-muted-foreground" />
        </button>
      </header>

      {showSettings && (
        <div className="absolute top-14 right-4 z-50 bg-card border border-border rounded-2xl shadow-lg p-4 w-64">
          <p className="text-sm font-semibold mb-2">Settings</p>
          <p className="text-xs text-muted-foreground mb-3">All data is stored locally on your device. No account needed.</p>
          <button
            onClick={() => {
              if (confirm("Clear all data? This cannot be undone.")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full text-sm font-semibold text-destructive bg-destructive/10 py-2 rounded-xl active:scale-95 transition-transform"
          >
            Clear All Data
          </button>
          <button
            onClick={() => setShowSettings(false)}
            className="w-full text-sm font-semibold text-muted-foreground mt-2 py-2 rounded-xl bg-secondary active:scale-95 transition-transform"
          >
            Close
          </button>
        </div>
      )}

      {showSettings && (
        <div className="absolute inset-0 z-40" onClick={() => setShowSettings(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {tab === "groups" && (
          <GroupsPage
            groups={store.groups}
            activeGroupId={store.activeGroupId}
            onSelect={id => { store.setActiveGroupId(id); setTab("add"); }}
            onCreate={(name, members) => { store.createGroup(name, members); setTab("add"); }}
            onDelete={store.deleteGroup}
          />
        )}
        {tab === "add" && (
          <AddExpensePage
            group={store.activeGroup}
            expenses={groupExpenses}
            onAdd={(title, amount, paidBy) => {
              if (store.activeGroup) store.addExpense(store.activeGroup.id, title, amount, paidBy);
            }}
            onDelete={store.deleteExpense}
            getMemberName={(groupId, memberId) => store.getMemberName(groupId, memberId)}
          />
        )}
        {tab === "result" && (
          <ResultPage
            group={store.activeGroup}
            settlements={settlements}
            expenses={groupExpenses}
            getMemberName={(groupId, memberId) => store.getMemberName(groupId, memberId)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-border px-2 py-2 pb-safe flex items-center gap-1 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        {([
          { id: "add" as Tab, label: "Add Expense", icon: PlusCircle },
          { id: "groups" as Tab, label: "Groups", icon: Users },
          { id: "result" as Tab, label: "Result", icon: TrendingUp },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-2 rounded-xl transition-all active:scale-95 ${
              tab === id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon size={20} strokeWidth={tab === id ? 2.5 : 1.8} />
            <span className={`text-[10px] font-semibold leading-tight ${tab === id ? "text-primary" : ""}`}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
