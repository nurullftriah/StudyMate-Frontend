import { useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../api/axios.js';
import RequestCard from '../components/RequestCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

function Requests() {
  const [requests, setRequests] = useState({
    incoming: [],
    outgoing: [],
    history: []
  });
  const [activeTab, setActiveTab] = useState('incoming');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Permintaan gagal dimuat.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function respondRequest(id, status) {
    setMessage('');
    setError('');

    try {
      await api.patch(`/requests/${id}`, { status });
      setMessage(
        status === 'accepted'
          ? 'Permintaan berhasil diterima.'
          : 'Permintaan berhasil ditolak.'
      );
      loadRequests();
    } catch (err) {
      setError(getErrorMessage(err, 'Permintaan gagal diproses.'));
    }
  }

  async function cancelRequest(id) {
    setMessage('');
    setError('');

    try {
      await api.delete(`/requests/${id}`);
      setMessage('Permintaan berhasil dibatalkan.');
      loadRequests();
    } catch (err) {
      setError(getErrorMessage(err, 'Permintaan gagal dibatalkan.'));
    }
  }

  const currentList = useMemo(
    () => requests[activeTab] || [],
    [requests, activeTab]
  );

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <h2>Permintaan Partner Belajar</h2>
          <p>
            Kelola permintaan partner belajar anda, terima atau tolak permintaan
            masuk, serta pantau permintaan yang sudah dikirim.
          </p>
        </div>
      </div>

      <div className="tabs request-tabs">
        <button
          className={activeTab === 'incoming' ? 'active' : ''}
          onClick={() => setActiveTab('incoming')}
        >
          Masuk ({requests.incoming.length})
        </button>

        <button
          className={activeTab === 'outgoing' ? 'active' : ''}
          onClick={() => setActiveTab('outgoing')}
        >
          Dikirim ({requests.outgoing.length})
        </button>

        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Riwayat ({requests.history.length})
        </button>
      </div>

      {message ? <div className="alert success">{message}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      <section className="request-list">
        {loading ? <div className="card-skeleton">Memuat permintaan...</div> : null}

        {!loading && currentList.length === 0 ? (
          <EmptyState
            title="Belum ada data"
            description="Permintaan partner belajar akan tampil pada halaman ini."
          />
        ) : null}

        {!loading &&
          currentList.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              type={activeTab}
              onAccept={(id) => respondRequest(id, 'accepted')}
              onReject={(id) => respondRequest(id, 'rejected')}
              onCancel={cancelRequest}
            />
          ))}
      </section>
    </div>
  );
}

export default Requests;