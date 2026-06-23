import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/axios.js';
import PartnerCard from '../components/PartnerCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

const initialFilters = {
  topic: '',
  university: '',
  studyProgram: '',
  keyword: '',
  availability: '',
  learningMode: ''
};

function SearchPartner() {
  const [filters, setFilters] = useState(initialFilters);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadPartners(activeFilters = filters) {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users/partners', { params: activeFilters });
      setPartners(response.data.partners);
    } catch (err) {
      setError(getErrorMessage(err, 'Data partner gagal dimuat.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPartners(initialFilters);
  }, []);

  function handleChange(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadPartners(filters);
  }

  function resetFilters() {
    setFilters(initialFilters);
    loadPartners(initialFilters);
  }

  async function sendRequest(partner) {
    setMessage('');
    setError('');

    try {
      await api.post('/requests', {
        receiverId: partner.id,
        message: `Halo ${partner.name}, ayo belajar bersama di StudyMate!`
      });

      setMessage(`Permintaan berhasil dikirim ke ${partner.name}.`);
      setPartners((current) =>
        current.map((item) =>
          item.id === partner.id
            ? { ...item, connectionStatus: 'pending' }
            : item
        )
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Permintaan gagal dikirim.'));
    }
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <h2>Cari Partner Belajar</h2>
          <p>
            Gunakan filter agar partner yang ditemukan sesuai dengan jadwal,
            mode belajar, dan minat yang kamu butuhkan.
          </p>
        </div>
      </div>

      <section className="content-card search-partner-card">
        <form className="filter-grid search-filter-grid" onSubmit={handleSubmit}>
          <label>
            Topik Belajar
            <input
              name="topic"
              value={filters.topic}
              onChange={handleChange}
              placeholder="Pemrograman, UI Design"
            />
          </label>

          <label>
            Universitas
            <input
              name="university"
              value={filters.university}
              onChange={handleChange}
              placeholder="Nama universitas"
            />
          </label>

          <label>
            Program Studi
            <input
              name="studyProgram"
              value={filters.studyProgram}
              onChange={handleChange}
              placeholder="Program studi"
            />
          </label>

          <label>
            Kata Kunci
            <input
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Nama, minat, kampus"
            />
          </label>

          <label>
            Jadwal Tersedia
            <select
              name="availability"
              value={filters.availability}
              onChange={handleChange}
            >
              <option value="">Semua jadwal</option>
              <option value="Senin - Jumat">Senin - Jumat</option>
              <option value="Weekend">Weekend</option>
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Malam">Malam</option>
              <option value="Fleksibel">Fleksibel</option>
            </select>
          </label>

          <label>
            Mode Belajar
            <select
              name="learningMode"
              value={filters.learningMode}
              onChange={handleChange}
            >
              <option value="">Semua mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </label>

          <div className="filter-actions">
            <button className="primary-button" type="submit">
              Terapkan Filter
            </button>
            <button className="ghost-button" type="button" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </form>
      </section>

      {message ? <div className="alert success">{message}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      <section className="partner-list">
        {loading ? <div className="card-skeleton">Mencari partner belajar...</div> : null}

        {!loading && partners.length === 0 ? (
          <EmptyState
            title="Partner belum ditemukan"
            description="Coba ubah kata kunci atau filter pencarian anda."
          />
        ) : null}

        {!loading &&
          partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onRequest={sendRequest}
            />
          ))}
      </section>
    </div>
  );
}

export default SearchPartner;