
export default function StatCard({ icon: Icon, label, value, note, tone='indigo' }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div><p className="muted">{label}</p><strong>{value ?? '—'}</strong><small>{note}</small></div></article>;
}
