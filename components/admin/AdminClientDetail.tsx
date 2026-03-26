"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type AdminClientUserRow = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
};

export function AdminClientDetail({
  clientId,
  clientCode,
  companyName,
  clientIsActive,
  users: initialUsers,
}: {
  clientId: string;
  clientCode: string;
  companyName: string;
  clientIsActive: boolean;
  users: AdminClientUserRow[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [company, setCompany] = useState(companyName);
  const [active, setActive] = useState(clientIsActive);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patchClient(body: { companyName?: string; isActive?: boolean }) {
    const res = await fetch(`/api/admin/clients/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) throw new Error(data.error ?? "Update failed");
  }

  async function saveClientSettings(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await patchClient({ companyName: company.trim(), isActive: active });
      setMessage("Client updated");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          name: newName.trim(),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        user?: AdminClientUserRow;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not add user");
        return;
      }
      if (data.user) {
        setUsers((u) => [data.user!, ...u]);
        setNewEmail("");
        setNewPassword("");
        setNewName("");
        setMessage("User created");
      }
      router.refresh();
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function toggleUser(userId: string, next: boolean) {
    setError(null);
    setMessage(null);
    const res = await fetch(
      `/api/admin/clients/${clientId}/users/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: next }),
      }
    );
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Update failed");
      return;
    }
    setUsers((list) =>
      list.map((u) => (u.id === userId ? { ...u, isActive: next } : u))
    );
    setMessage(next ? "User activated" : "User deactivated");
    router.refresh();
  }

  async function resetPassword(userId: string, password: string) {
    setError(null);
    setMessage(null);
    const res = await fetch(
      `/api/admin/clients/${clientId}/users/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      }
    );
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Reset failed");
      return;
    }
    setMessage("Password updated");
  }

  return (
    <div>
      <Link href="/admin/clients" className="profyt-link">
        Back to clients
      </Link>

      <h1 className="mt-6 font-serif text-3xl text-black">{clientCode}</h1>
      <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-mid">
        Client detail
      </p>

      {error ? (
        <p className="mt-6 border border-l2/40 bg-l1/30 px-3 py-2 text-xs text-l4">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-6 border border-pale bg-off px-3 py-2 text-xs text-dark">
          {message}
        </p>
      ) : null}

      <form onSubmit={saveClientSettings} className="profyt-card mt-8 max-w-lg space-y-4 p-8">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-dark">
          Client settings
        </h2>
        <div>
          <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
            Company name
          </label>
          <input
            className="profyt-input mt-2"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-mid">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            disabled={loading}
          />
          Active (portal login allowed)
        </label>
        <button type="submit" disabled={loading} className="profyt-btn-primary px-6">
          Save settings
        </button>
      </form>

      <section className="mt-12">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-dark">
          Portal users
        </h2>
        <p className="mt-1 text-sm text-mid">
          Each user signs in with this Client ID plus email and password.
        </p>

        <form
          onSubmit={addUser}
          className="profyt-card mt-6 max-w-lg space-y-3 p-6"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
            Add user
          </p>
          <input
            className="profyt-input"
            placeholder="Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            className="profyt-input"
            placeholder="Temporary password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            className="profyt-input"
            placeholder="Display name (optional)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="profyt-btn-primary w-full">
            Add user
          </button>
        </form>

        <div className="profyt-card mt-8 overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-pale bg-off">
              <tr>
                <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                  Email
                </th>
                <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                  Name
                </th>
                <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                  Active
                </th>
                <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-dark">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  disabled={loading}
                  onToggle={(t) => toggleUser(u.id, t)}
                  onResetPassword={(pw) => resetPassword(u.id, pw)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function UserRow({
  user,
  disabled,
  onToggle,
  onResetPassword,
}: {
  user: AdminClientUserRow;
  disabled: boolean;
  onToggle: (active: boolean) => void;
  onResetPassword: (password: string) => void;
}) {
  const [pw, setPw] = useState("");
  return (
    <tr className="border-b border-pale last:border-0">
      <td className="px-4 py-3 text-mid">{user.email}</td>
      <td className="px-4 py-3 text-mid">{user.name || "—"}</td>
      <td className="px-4 py-3">
        {user.isActive ? (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-dark">
            Yes
          </span>
        ) : (
          <span className="text-light">No</span>
        )}
      </td>
      <td className="space-y-2 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {user.isActive ? (
            <button
              type="button"
              disabled={disabled}
              className="profyt-btn-secondary px-2 py-1 text-[10px]"
              onClick={() => onToggle(false)}
            >
              Deactivate
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled}
              className="profyt-btn-secondary px-2 py-1 text-[10px]"
              onClick={() => onToggle(true)}
            >
              Activate
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <input
            className="profyt-input max-w-[160px] py-1.5 text-xs"
            placeholder="New password"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={disabled}
          />
          <button
            type="button"
            disabled={disabled || pw.length < 8}
            className="profyt-btn-secondary px-2 py-1 text-[10px]"
            onClick={() => {
              void onResetPassword(pw);
              setPw("");
            }}
          >
            Set
          </button>
        </div>
      </td>
    </tr>
  );
}
