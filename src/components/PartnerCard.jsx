function PartnerCard({ partner, onRequest, compact = false }) {
  const initial = partner?.name?.[0]?.toUpperCase() || 'P';
  const status = partner?.connectionStatus;
  const disabled = status === 'pending' || status === 'accepted';

  const label =
    status === 'pending'
      ? 'Menunggu'
      : status === 'accepted'
        ? 'Terhubung'
        : 'Kirim Permintaan';

  // =========================
  // CARD UNTUK DASHBOARD
  // AVATAR DI TENGAH
  // =========================
  if (compact) {
    return (
      <article className="partner-card compact partner-card-compact-centered">
        {partner?.profilePhoto ? (
          <img
            src={partner.profilePhoto}
            alt={partner.name}
            className="avatar-image compact-avatar-centered"
          />
        ) : (
          <div
            className="avatar compact-avatar-fallback compact-avatar-centered-fallback"
            style={{ backgroundColor: partner.avatarColor || '#426ca8' }}
          >
            {initial}
          </div>
        )}

        <div className="compact-centered-body">
          <div className="compact-centered-name-row">
            <strong>{partner.name}</strong>
          </div>

          {partner.skillLevel ? (
            <div className="compact-centered-level">
              <span className="skill-badge">{partner.skillLevel}</span>
            </div>
          ) : null}

          <span className="compact-centered-university">
            {partner.university || 'Universitas belum diisi'}
          </span>

          <small className="compact-centered-program">
            {partner.studyProgram || 'Program studi belum diisi'}
          </small>

          <div className="compact-meta-column">
            <span className="meta-pill">
              {partner.learningMode || 'Mode belum diisi'}
            </span>
            <span className="meta-pill">
              {partner.availability || 'Jadwal belum diisi'}
            </span>
          </div>

          <div className="compact-tags centered-tags">
            {(partner.interests || []).slice(0, 4).map((interest) => (
              <em key={interest}>{interest}</em>
            ))}
          </div>
        </div>
      </article>
    );
  }

  // =========================
  // CARD UNTUK HALAMAN CARI PARTNER
  // MODE + JADWAL + MINAT SEJAJAR
  // =========================
  return (
    <article className="partner-card partner-card-search-clean">
      <div className="partner-search-left">
        {partner?.profilePhoto ? (
          <img
            src={partner.profilePhoto}
            alt={partner.name}
            className="avatar-image"
          />
        ) : (
          <div
            className="avatar"
            style={{ backgroundColor: partner.avatarColor || '#426ca8' }}
          >
            {initial}
          </div>
        )}

        <div className="partner-search-main">
          <div className="partner-search-name-row">
            <strong>{partner.name}</strong>
            {partner.skillLevel ? (
              <span className="skill-badge">{partner.skillLevel}</span>
            ) : null}
          </div>

          <span>{partner.university || 'Universitas belum diisi'}</span>
          <small>{partner.studyProgram || 'Program studi belum diisi'}</small>
        </div>
      </div>

      <div className="partner-search-info-inline">
        <div className="info-inline-group">
          <span className="inline-label">Mode:</span>
          <span className="meta-pill">
            {partner.learningMode || 'Mode belum diisi'}
          </span>
        </div>

        <div className="info-inline-group">
          <span className="inline-label">Jadwal:</span>
          <span className="meta-pill">
            {partner.availability || 'Jadwal belum diisi'}
          </span>
        </div>

        <div className="info-inline-group interest-inline-group">
          <span className="inline-label">Minat:</span>
          <div className="inline-interest-tags">
            {(partner.interests || []).slice(0, 4).map((interest) => (
              <em key={interest}>{interest}</em>
            ))}
          </div>
        </div>
      </div>

      {onRequest ? (
        <button
          className={`primary-button small-button request-cta ${disabled ? 'disabled' : ''}`}
          onClick={() => onRequest(partner)}
          disabled={disabled}
        >
          {label}
        </button>
      ) : null}
    </article>
  );
}

export default PartnerCard;