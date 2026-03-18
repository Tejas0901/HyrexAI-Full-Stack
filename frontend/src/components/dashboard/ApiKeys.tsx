import { useState } from "react";
import { Copy, Check, Trash2, Plus, Eye, EyeOff } from "lucide-react";

type Key = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
};

const DEMO_KEYS: Key[] = [
  { id: "1", name: "Production", key: "hx_prod_sk_9f2a4b8c1d3e7f6a", created: "Jan 15, 2026", lastUsed: "2 min ago", status: "active" },
  { id: "2", name: "Development", key: "hx_dev_sk_2b5e9d1a8f4c3b7e", created: "Feb 3, 2026", lastUsed: "1 hour ago", status: "active" },
  { id: "3", name: "Staging", key: "hx_stg_sk_7d3c1b9a2e5f8d4c", created: "Feb 20, 2026", lastUsed: "3 days ago", status: "revoked" },
];

const ApiKeys = () => {
  const [keys, setKeys] = useState<Key[]>(DEMO_KEYS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealId, setRevealId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCopy = (k: Key) => {
    navigator.clipboard.writeText(k.key);
    setCopiedId(k.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k))
    );
  };

  const handleDelete = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newKey: Key = {
      id: Date.now().toString(),
      name: newName.trim(),
      key: `hx_${newName.trim().toLowerCase().replace(/\s+/g, "_")}_sk_${Math.random().toString(36).slice(2, 18)}`,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
      status: "active",
    };
    setKeys((prev) => [newKey, ...prev]);
    setNewName("");
    setCreating(false);
  };

  const maskKey = (key: string) => {
    const parts = key.split("_");
    const prefix = parts.slice(0, -1).join("_");
    const secret = parts[parts.length - 1];
    return `${prefix}_${"•".repeat(8)}${secret.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">API Keys</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your API keys for accessing Hyrex AI services.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        >
          <Plus size={15} />
          Create Key
        </button>
      </div>

      {/* Demo banner */}
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
        <p className="text-sm text-primary font-medium">
          Demo mode — these are sample API keys. Real key management will be available once the backend is connected.
        </p>
      </div>

      {/* Create form */}
      {creating && (
        <div className="bg-white dark:bg-gray-800 border border-primary/30 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">New API Key</h2>
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Key Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Production, Development"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors"
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreating(false); }}
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="btn-gradient px-5 py-2 rounded-lg text-sm font-medium text-white">
              Create
            </button>
            <button
              onClick={() => { setCreating(false); setNewName(""); }}
              className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Keys table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Key</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Used</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</span>
        </div>

        {keys.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-600">
            No API keys yet. Create one to get started.
          </div>
        )}

        {keys.map((k) => (
          <div
            key={k.id}
            className={`grid grid-cols-[1fr_2fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0 items-center ${
              k.status === "revoked" ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{k.name}</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                k.status === "active"
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600"
              }`}>
                {k.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <code className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate">
                {revealId === k.id ? k.key : maskKey(k.key)}
              </code>
              <button
                onClick={() => setRevealId(revealId === k.id ? null : k.id)}
                className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 flex-shrink-0 transition-colors"
              >
                {revealId === k.id ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{k.created}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{k.lastUsed}</span>

            <div className="flex items-center gap-2">
              {k.status === "active" && (
                <button
                  onClick={() => handleCopy(k)}
                  className="text-gray-400 dark:text-gray-600 hover:text-primary transition-colors"
                  title="Copy key"
                >
                  {copiedId === k.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              )}
              {k.status === "active" && (
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="text-xs text-gray-400 dark:text-gray-600 hover:text-amber-500 transition-colors font-medium"
                  title="Revoke key"
                >
                  Revoke
                </button>
              )}
              <button
                onClick={() => handleDelete(k.id)}
                className="text-gray-400 dark:text-gray-600 hover:text-red-500 transition-colors"
                title="Delete key"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Usage note */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Using your API key</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Pass your key in the Authorization header:</p>
        <code className="block text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-300">
          Authorization: Bearer hx_prod_sk_••••••••
        </code>
      </div>
    </div>
  );
};

export default ApiKeys;
