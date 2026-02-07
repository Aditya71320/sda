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
      <div className="glass-card flex items-center gap-3 px-5 py-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-accent" />
        <span className="text-sm text-txt-secondary">Loading profiles...</span>
      </div>
    )
  }

  const selected = profiles.find((p) => p.id === selectedId)

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-txt-tertiary">Profile & Watchlist</h2>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-bear-border bg-bear-bg px-4 py-3">
          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-bear/10">
            <svg className="h-3 w-3 text-bear" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="text-sm text-bear-text">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-bull-border bg-bull-bg px-4 py-3">
          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-bull/10">
            <svg className="h-3 w-3 text-bull" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-sm text-bull-text">{success}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px]">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">Profile</label>
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
            className="w-full rounded-xl border border-border-subtle bg-bg-inset px-3.5 py-2.5 text-sm text-txt-primary shadow-inset"
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
            className="rounded-xl border border-bear-border bg-bear-bg px-3.5 py-2.5 text-sm font-medium text-bear-text hover:bg-bear/10 active:scale-[0.97] disabled:opacity-50"
            title="Delete this profile"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2.5">
          <div className="min-w-[160px]">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">New profile</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Profile name"
              className="w-full rounded-xl border border-border-subtle bg-bg-inset px-3.5 py-2.5 text-sm text-txt-primary placeholder-txt-tertiary shadow-inset"
              disabled={creating}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl border border-border-subtle bg-zinc-800/60 px-3.5 py-2.5 text-sm font-medium text-txt-secondary hover:bg-zinc-700/60 hover:text-txt-primary active:scale-[0.97] disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>

      {/* Watchlist summary */}
      {selected && (
        <div className="mt-4 flex items-center gap-2.5 border-t border-border-subtle pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-txt-tertiary">Watchlist:</span>
          {selected.tickers.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selected.tickers.map((t) => (
                <span key={t} className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-txt-tertiary">(empty -- add tickers below)</span>
          )}
        </div>
      )}
    </div>
  )
}
