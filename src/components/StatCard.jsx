function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        {Icon ? <Icon size={52} strokeWidth={2.8} /> : null}
      </div>

      <strong>{value}</strong>
      <span>{label}</span>
      <small>{hint}</small>
    </article>
  );
}

export default StatCard;