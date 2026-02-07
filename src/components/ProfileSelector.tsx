import { useEffect, useState } from 'react'
import type { Profile } from '../api'
import { createProfile, deleteProfile, fetchProfiles, getProfile } from '../api'

interface ProfileSelectorProps {
  selectedId: string | null
  onSelect: (profile: Profile | null) => void
}

export default function ProfileSelector({ selectedId, onSelect }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setError(null)
    try {
      const list = await fetchProfiles()
      setProfiles(list)
      if (list.length && !selectedId) onSelect(list[0])
      if (selectedId && !list.find((p) => p.id === selectedId)) onSelect(list[0] ?? null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load profiles.'
      setError(`Backend not reachable. Start the server first (see README). ${msg}`)
      setProfiles([])
      onSelect(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim() || 'My profile'
    setCreating(true)
    setError(null)
    setSuccess(null)
    try {
      const p = await createProfile(name)
      setProfiles((prev) => [...prev, p])
      setNewName('')
      onSelect(p)
      setSuccess(`Profile "${p.name}" created.`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile. Is the backend running on port 8000?')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId || !selected) return
    if (!window.confirm(`Delete profile "${selected.name}"? This cannot be undone.`)) return
    setDeleting(true)
    setError(null)
    setSuccess(null)
    try {
      await deleteProfile(selectedId)
      const remaining = profiles.filter((p) => p.id !== selectedId)
      setProfiles(remaining)
      onSelect(remaining[0] ?? null)
      setSuccess('Profile deleted.')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-surface px-5 py-4 shadow-card">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
        <span className="text-sm text-slate-400">Loading profiles...</span>
      </div>
    )
  }

  const selected = profiles.find((p) => p.id === selectedId)

  return (
    <div className="rounded-2xl border border-slate-800 bg-surface p-5 shadow-card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Profile & Watchlist</h2>
      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-300">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2.5 text-sm text-emerald-300">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[170px]">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Profile</label>
          <select
            value={selectedId ?? ''}
            onChange={async (e) => {
              const id = e.target.value
              if (!id) {
                onSelect(null)
                return
              }
              try {
                const p = await getProfile(id)
                onSelect(p)
              } catch {
                const p = profiles.find((x) => x.id === id)
                onSelect(p ?? null)
              }
            }}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="">-- Select --</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {selected && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-800/60 bg-red-950/50 px-3.5 py-2.5 text-sm font-medium text-red-300 hover:bg-red-900/50 active:scale-[0.98] disabled:opacity-50"
            title="Delete this profile"
          >
            {deleting ? 'Deleting...' : 'Delete profile'}
          </button>
        )}
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2.5">
          <div className="min-w-[150px]">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">New profile</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Profile name"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              disabled={creating}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-slate-700/80 px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-600/80 active:scale-[0.98] disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
      {selected && (
        <div className="mt-3.5 flex items-center gap-2 border-t border-slate-800/80 pt-3.5">
          <span className="text-xs font-medium text-slate-500">Watchlist:</span>
          <span className="text-xs text-slate-400">
            {selected.tickers.length ? selected.tickers.join(', ') : '(empty -- add tickers below)'}
          </span>
        </div>
      )}
    </div>
  )
}
