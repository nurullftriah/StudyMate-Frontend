function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-illustration"></div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;
