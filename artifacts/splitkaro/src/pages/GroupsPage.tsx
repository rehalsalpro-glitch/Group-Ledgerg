import { useState, useRef } from "react";
import { Users, Plus, Trash2, UserPlus, X, MoreVertical, Pencil, Share2, Check, Copy } from "lucide-react";
import type { Group } from "../store";

interface Props {
  groups: Group[];
  activeGroupId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string, members: string[]) => void;
  onUpdate: (id: string, name: string, members: string[]) => void;
  onDelete: (id: string) => void;
  generateShareText: (groupId: string) => string;
}

interface MemberEntry {
  key: string;
  name: string;
}

let counter = 0;
function mkKey() { return `m-${++counter}-${Date.now()}`; }

export default function GroupsPage({ groups, activeGroupId, onSelect, onCreate, onUpdate, onDelete, generateShareText }: Props) {
  // ── Create form ──────────────────────────────────────────────
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const memberInputRef = useRef<HTMLInputElement>(null);

  // ── 3-dot menu ───────────────────────────────────────────────
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [menuPhase, setMenuPhase] = useState<"main" | "deleteConfirm">("main");

  // ── Edit popup ───────────────────────────────────────────────
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState("");
  const [editMembers, setEditMembers] = useState<MemberEntry[]>([]);
  const [editMemberInput, setEditMemberInput] = useState("");
  const editMemberInputRef = useRef<HTMLInputElement>(null);

  // ── Share popup ──────────────────────────────────────────────
  const [shareText, setShareText] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Create helpers ───────────────────────────────────────────
  function handleAddMember() {
    const name = memberInput.trim();
    if (!name) return;
    setMembers(prev => [...prev, { key: mkKey(), name }]);
    setMemberInput("");
    memberInputRef.current?.focus();
  }

  function handleCreate() {
    if (!groupName.trim() || members.length < 2) return;
    onCreate(groupName.trim(), members.map(m => m.name));
    setGroupName(""); setMembers([]); setMemberInput(""); setCreating(false);
  }

  function handleCancelCreate() {
    setCreating(false); setGroupName(""); setMembers([]); setMemberInput("");
  }

  // ── Menu helpers ─────────────────────────────────────────────
  function openMenu(e: React.MouseEvent, groupId: string) {
    e.stopPropagation();
    if (menuOpenId === groupId) { setMenuOpenId(null); return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    setMenuOpenId(groupId);
    setMenuPhase("main");
  }

  function closeMenu() { setMenuOpenId(null); setMenuPhase("main"); }

  // ── Edit helpers ─────────────────────────────────────────────
  function openEdit(group: Group) {
    closeMenu();
    setEditingGroup(group);
    setEditName(group.name);
    setEditMembers(group.members.map(m => ({ key: mkKey(), name: m.name })));
    setEditMemberInput("");
  }

  function handleAddEditMember() {
    const name = editMemberInput.trim();
    if (!name) return;
    setEditMembers(prev => [...prev, { key: mkKey(), name }]);
    setEditMemberInput("");
    editMemberInputRef.current?.focus();
  }

  function handleSaveEdit() {
    if (!editingGroup || !editName.trim() || editMembers.length < 2) return;
    onUpdate(editingGroup.id, editName.trim(), editMembers.map(m => m.name));
    setEditingGroup(null);
  }

  // ── Share helpers ─────────────────────────────────────────────
  function openShare(groupId: string) {
    closeMenu();
    setShareText(generateShareText(groupId));
    setCopied(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  const needed = Math.max(0, 2 - members.length);
  const editNeeded = Math.max(0, 2 - editMembers.length);

  return (
    <div className="flex flex-col h-full">

      {/* ── Menu overlay ─────────────────────────────────────── */}
      {menuOpenId && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeMenu} />
          <div
            className="fixed z-50 bg-card border border-border rounded-2xl shadow-xl py-1.5 w-48 overflow-hidden"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            {menuPhase === "main" ? (
              <>
                <button
                  onClick={() => { const g = groups.find(x => x.id === menuOpenId); if (g) openEdit(g); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                >
                  <Pencil size={15} className="text-muted-foreground" /> Edit Group
                </button>
                <button
                  onClick={() => { openShare(menuOpenId); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                >
                  <Share2 size={15} className="text-muted-foreground" /> Share Group
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => setMenuPhase("deleteConfirm")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 active:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={15} /> Delete Group
                </button>
              </>
            ) : (
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-foreground mb-1">Delete group?</p>
                <p className="text-xs text-muted-foreground mb-3">This will also delete all expenses. This can't be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onDelete(menuOpenId); closeMenu(); }}
                    className="flex-1 bg-destructive text-destructive-foreground text-xs font-semibold py-2 rounded-xl active:scale-95 transition-transform"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setMenuPhase("main")}
                    className="flex-1 bg-secondary text-secondary-foreground text-xs font-semibold py-2 rounded-xl active:scale-95 transition-transform"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Edit popup ───────────────────────────────────────── */}
      {editingGroup && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setEditingGroup(null)} />
          <div className="fixed inset-x-4 top-24 z-50 bg-card border border-border rounded-2xl shadow-xl p-4 max-w-sm mx-auto">
            <p className="text-sm font-semibold mb-3">Edit Group</p>

            <input
              autoFocus
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm mb-2.5 bg-background outline-none focus:ring-2 focus:ring-primary"
              placeholder="Group name"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") editMemberInputRef.current?.focus(); }}
            />

            <div className="flex gap-2 mb-2">
              <input
                ref={editMemberInputRef}
                className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add member name"
                value={editMemberInput}
                onChange={e => setEditMemberInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddEditMember(); } }}
              />
              <button
                onClick={handleAddEditMember}
                disabled={!editMemberInput.trim()}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3.5 py-2 rounded-xl active:scale-95 transition-transform disabled:opacity-40 whitespace-nowrap"
              >
                <UserPlus size={14} /> Add
              </button>
            </div>

            {editMembers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {editMembers.map(m => (
                  <span
                    key={m.key}
                    className="animate-pop-in flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1.5 rounded-full"
                  >
                    {m.name}
                    <button
                      onClick={() => setEditMembers(prev => prev.filter(em => em.key !== m.key))}
                      className="ml-0.5 opacity-60 hover:opacity-100 hover:text-destructive transition-all"
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {editNeeded > 0 && (
              <p className="text-xs text-muted-foreground mb-2.5">
                {editMembers.length === 0 ? "Add at least 2 members." : "Add 1 more member to continue."}
              </p>
            )}

            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => setEditingGroup(null)}
                className="text-sm font-medium text-muted-foreground py-1 active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editName.trim() || editMembers.length < 2}
                className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Share popup ──────────────────────────────────────── */}
      {shareText && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setShareText("")} />
          <div className="fixed inset-x-4 bottom-24 z-50 bg-card border border-border rounded-2xl shadow-xl p-4 max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Share Summary</p>
              <button
                onClick={() => setShareText("")}
                className="p-1 rounded-lg bg-secondary active:scale-90 transition-transform"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>

            <div className="bg-background border border-border rounded-xl p-3 mb-3 max-h-48 overflow-y-auto">
              <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">{shareText}</pre>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-all ${
                  copied ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-transform"
              >
                <Share2 size={14} />
                WhatsApp
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Groups</span>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-full shadow active:scale-95 transition-transform"
        >
          <Plus size={14} /> New
        </button>
      </div>

      {/* ── Create form ──────────────────────────────────────── */}
      {creating && (
        <div className="mx-4 mb-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
          <p className="text-sm font-semibold mb-3 text-foreground">Create a new group</p>

          <input
            autoFocus
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm mb-2.5 bg-background outline-none focus:ring-2 focus:ring-primary"
            placeholder="Group name (e.g. Goa Trip)"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") memberInputRef.current?.focus(); }}
          />

          <div className="flex gap-2 mb-2">
            <input
              ref={memberInputRef}
              className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter member name"
              value={memberInput}
              onChange={e => setMemberInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddMember(); } }}
            />
            <button
              onClick={handleAddMember}
              disabled={!memberInput.trim()}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3.5 py-2 rounded-xl active:scale-95 transition-transform disabled:opacity-40 whitespace-nowrap"
            >
              <UserPlus size={14} /> Add
            </button>
          </div>

          {members.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {members.map(m => (
                <span
                  key={m.key}
                  className="animate-pop-in flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1.5 rounded-full"
                >
                  {m.name}
                  <button
                    onClick={() => setMembers(prev => prev.filter(em => em.key !== m.key))}
                    className="ml-0.5 opacity-60 hover:opacity-100 hover:text-destructive transition-all"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {needed > 0 && (
            <p className="text-xs text-muted-foreground mb-2.5">
              {members.length === 0 ? "Add at least 2 members to create a group." : "Add 1 more member to continue."}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1">
            <button onClick={handleCancelCreate} className="text-sm font-medium text-muted-foreground py-1 active:scale-95 transition-transform">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || members.length < 2}
              className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
            >
              Create Group
            </button>
          </div>
        </div>
      )}

      {/* ── Group list ───────────────────────────────────────── */}
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
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0 ${
              activeGroupId === group.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
            }`}>
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{group.name}</p>
              <p className={`text-xs mt-0.5 truncate ${activeGroupId === group.id ? "text-white/70" : "text-muted-foreground"}`}>
                {group.members.length} members · {group.members.map(m => m.name).join(", ")}
              </p>
            </div>
            <button
              onClick={e => openMenu(e, group.id)}
              className={`ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-transform ${
                activeGroupId === group.id ? "bg-white/20" : "bg-secondary"
              }`}
            >
              <MoreVertical size={16} className={activeGroupId === group.id ? "text-white/80" : "text-muted-foreground"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
