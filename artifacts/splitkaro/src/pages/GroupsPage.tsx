import { useState, useRef } from "react";
import { Users, Plus, Trash2, ChevronRight, UserPlus, X } from "lucide-react";
import type { Group } from "../store";

interface Props {
  groups: Group[];
  activeGroupId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string, members: string[]) => void;
  onDelete: (id: string) => void;
}

export default function GroupsPage({ groups, activeGroupId, onSelect, onCreate, onDelete }: Props) {
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);

  function handleAddMember() {
    const name = memberInput.trim();
    if (!name) return;
    setMembers(prev => [...prev, name]);
    setMemberInput("");
    memberInputRef.current?.focus();
  }

  function handleRemoveMember(index: number) {
    setMembers(prev => prev.filter((_, i) => i !== index));
  }

  function handleCreate() {
    if (!groupName.trim() || members.length < 2) return;
    onCreate(groupName.trim(), members);
    setGroupName("");
    setMembers([]);
    setMemberInput("");
    setCreating(false);
  }

  function handleCancel() {
    setCreating(false);
    setGroupName("");
    setMembers([]);
    setMemberInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Groups</span>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-full shadow active:scale-95 transition-transform"
        >
          <Plus size={14} /> New
        </button>
      </div>

      {creating && (
        <div className="mx-4 mb-3 p-3 rounded-2xl bg-card border border-border shadow-sm max-w-[92%]">
          <p className="text-sm font-semibold mb-2">Create a new group</p>

          <input
            autoFocus
            className="w-full border border-border rounded-xl px-3 py-2 text-sm mb-2 bg-background outline-none focus:ring-2 focus:ring-primary"
            placeholder="Group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />

          <div className="flex gap-2 mb-2">
            <input
              ref={memberInputRef}
              className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter member name"
              value={memberInput}
              onChange={e => setMemberInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddMember(); } }}
            />
            <button
              onClick={handleAddMember}
              disabled={!memberInput.trim()}
              className="flex items-center gap-1 bg-primary/10 text-primary text-sm font-semibold px-3 py-2 rounded-xl active:scale-95 transition-transform disabled:opacity-40 whitespace-nowrap"
            >
              <UserPlus size={14} /> Add
            </button>
          </div>

          {members.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {members.map((name, i) => (
                <span
                  key={i}
                  className="animate-pop-in flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {name}
                  <button
                    onClick={() => handleRemoveMember(i)}
                    className="ml-0.5 hover:text-destructive transition-colors"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mt-1">
            <button
              onClick={handleCancel}
              className="text-sm font-medium text-muted-foreground active:scale-95 transition-transform"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || members.length < 2}
              className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
            >
              Create Group
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {groups.length === 0 && !creating && (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users size={28} className="text-primary" />
            </div>
            <p className="font-semibold text-base">No groups yet</p>
            <p className="text-sm text-muted-foreground mt-1">Tap "New" to create your first group</p>
          </div>
        )}
        {groups.map(group => (
          <div
            key={group.id}
            onClick={() => onSelect(group.id)}
            className={`relative flex items-center px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all ${
              activeGroupId === group.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border"
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
              activeGroupId === group.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
            }`}>
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{group.name}</p>
              <p className={`text-xs mt-0.5 ${activeGroupId === group.id ? "text-white/70" : "text-muted-foreground"}`}>
                {group.members.length} members: {group.members.map(m => m.name).join(", ")}
              </p>
            </div>
            {deleteId === group.id ? (
              <div className="flex gap-2 ml-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onDelete(group.id)}
                  className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-lg font-semibold active:scale-95 transition-transform"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="text-xs bg-white/20 px-2 py-1 rounded-lg font-semibold active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={e => { e.stopPropagation(); setDeleteId(group.id); }}
                  className={`p-1.5 rounded-lg active:scale-95 transition-transform ${
                    activeGroupId === group.id ? "bg-white/20" : "bg-destructive/10"
                  }`}
                >
                  <Trash2 size={14} className={activeGroupId === group.id ? "text-white" : "text-destructive"} />
                </button>
                <ChevronRight size={16} className={activeGroupId === group.id ? "text-white/60" : "text-muted-foreground"} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
