function formatStatus(status) {
  if (status === 'accepted') return 'Diterima';
  if (status === 'rejected') return 'Ditolak';
  if (status === 'pending') return 'Menunggu';
  return status;
}

function RequestCard({ request, type, onAccept, onReject, onCancel }) {
  const person = type === 'incoming' ? request.sender : request.receiver;
  const initial = person?.name?.[0]?.toUpperCase() || 'P';

  return (
    <article className="request-card request-card-redesign">
      <div className="request-card-main">
        {person?.profilePhoto ? (
          <img
            src={person.profilePhoto}
            alt={person.name}
            className="avatar-image"
          />
        ) : (
          <div
            className="avatar"
            style={{ backgroundColor: person?.avatarColor || '#426ca8' }}
          >
            {initial}
          </div>
        )}

        <div className="request-info">
          <div className="request-head">
            <strong>{person?.name}</strong>
            {type === 'history' ? (
              <span className={`status-pill ${request.status}`}>
                {formatStatus(request.status)}
              </span>
            ) : null}
          </div>

          <span>
            {[person?.studyProgram, person?.university].filter(Boolean).join(' • ') || 'Informasi akademik belum diisi'}
          </span>

          <div className="request-meta">
            {person?.learningMode ? (
              <span className="meta-pill">{person.learningMode}</span>
            ) : null}
            {person?.availability ? (
              <span className="meta-pill">{person.availability}</span>
            ) : null}
          </div>

          <small>{request.message || 'Tidak ada pesan tambahan.'}</small>
        </div>
      </div>

      <div className="request-actions request-actions-redesign">
        {type === 'incoming' ? (
          <>
            <button
              className="primary-button small-button"
              onClick={() => onAccept(request._id)}
            >
              Terima
            </button>
            <button
              className="ghost-button small-button reject-button"
              onClick={() => onReject(request._id)}
            >
              Tolak
            </button>
          </>
        ) : type === 'outgoing' ? (
          <>
            <span className="status-pill pending">Menunggu</span>
            <button
              className="ghost-button small-button"
              onClick={() => onCancel(request._id)}
            >
              Batalkan
            </button>
          </>
        ) : (
          <span className={`status-pill ${request.status}`}>
            {formatStatus(request.status)}
          </span>
        )}
      </div>
    </article>
  );
}

export default RequestCard;