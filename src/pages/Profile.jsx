import { useEffect, useState } from 'react';
import {
  GraduationCap,
  ClipboardList,
  FileText,
  UserCircle2,
  Clock3,
  MonitorSmartphone
} from 'lucide-react';
import api, { getErrorMessage } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function interestsToString(interests) {
  return Array.isArray(interests) ? interests.join(' • ') : '';
}

function interestsToInputString(interests) {
  return Array.isArray(interests) ? interests.join(', ') : '';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Profile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    username: '',
    university: '',
    studyProgram: '',
    interests: '',
    skillLevel: 'Pemula',
    bio: '',
    learningMode: '',
    availability: '',
    profilePhoto: ''
  });

  const [editing, setEditing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        university: user.university || '',
        studyProgram: user.studyProgram || '',
        interests: interestsToInputString(user.interests),
        skillLevel: user.skillLevel || 'Pemula',
        bio: user.bio || '',
        learningMode: user.learningMode || '',
        availability: user.availability || '',
        profilePhoto: user.profilePhoto || ''
      });

      setPreviewPhoto(user.profilePhoto || '');
    }
  }, [user]);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setPreviewPhoto(base64);
      setForm((current) => ({
        ...current,
        profilePhoto: base64
      }));
    } catch {
      setError('Foto profil gagal diproses.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.put('/users/me', form);
      updateUser(response.data.user);
      setMessage('Profil berhasil diperbarui.');
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Profil gagal diperbarui.'));
    }
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <h2>Profil Pengguna</h2>
          <p>Kelola informasi akun, minat belajar, jadwal, dan foto profil anda.</p>
        </div>
      </div>

      {message ? <div className="alert success">{message}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      <section className="profile-card profile-card-redesign">
        {/* FOTO PROFIL DI TENGAH */}
        <div className="profile-header profile-header-centered">
          <div className="profile-photo-wrap">
            {previewPhoto || user?.profilePhoto ? (
              <img
                src={previewPhoto || user?.profilePhoto}
                alt={user?.name}
                className="profile-photo-large"
              />
            ) : (
              <div
                className="avatar large"
                style={{ backgroundColor: user?.avatarColor || '#426ca8' }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}

            {editing ? (
              <label className="upload-photo-button">
                Ubah Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </label>
            ) : null}
          </div>

          <div className="profile-identity profile-identity-centered">
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </div>
        </div>

        {!editing ? (
          <>
            <div className="profile-details figma-profile-details">
              <div className="profile-detail-row">
                <div className="profile-detail-label">
                  <GraduationCap size={24} strokeWidth={2.2} />
                  <span>Universitas</span>
                </div>
                <strong>{user?.university || '-'}</strong>
              </div>

              <div className="profile-detail-row">
                <div className="profile-detail-label">
                  <UserCircle2 size={24} strokeWidth={2.2} />
                  <span>Program Studi</span>
                </div>
                <strong>{user?.studyProgram || '-'}</strong>
              </div>

              <div className="profile-detail-row">
                <div className="profile-detail-label">
                  <ClipboardList size={24} strokeWidth={2.2} />
                  <span>Minat Belajar</span>
                </div>
                <strong>{interestsToString(user?.interests) || '-'}</strong>
              </div>

              <div className="profile-detail-row">
                <div className="profile-detail-label">
                  <MonitorSmartphone size={24} strokeWidth={2.2} />
                  <span>Mode Belajar</span>
                </div>
                <strong>{user?.learningMode || '-'}</strong>
              </div>

              <div className="profile-detail-row">
                <div className="profile-detail-label">
                  <Clock3 size={24} strokeWidth={2.2} />
                  <span>Jadwal Tersedia</span>
                </div>
                <strong>{user?.availability || '-'}</strong>
              </div>

              <div className="profile-detail-row">
                <div className="profile-detail-label">
                  <FileText size={24} strokeWidth={2.2} />
                  <span>Bio</span>
                </div>
                <strong>{user?.bio || '-'}</strong>
              </div>
            </div>

            <button
              className="profile-edit-button"
              onClick={() => setEditing(true)}
            >
              Edit Profil
            </button>
          </>
        ) : (
          <form className="form-grid profile-form" onSubmit={handleSubmit}>
            <label>
              Nama
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Universitas
              <input
                name="university"
                value={form.university}
                onChange={handleChange}
              />
            </label>

            <label>
              Program Studi
              <input
                name="studyProgram"
                value={form.studyProgram}
                onChange={handleChange}
              />
            </label>

            <label>
              Level Belajar
              <select
                name="skillLevel"
                value={form.skillLevel}
                onChange={handleChange}
              >
                <option>Pemula</option>
                <option>Menengah</option>
                <option>Mahir</option>
              </select>
            </label>

            <label>
              Mode Belajar
              <select
                name="learningMode"
                value={form.learningMode}
                onChange={handleChange}
              >
                <option value="">Pilih mode belajar</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>

            <label className="full-field">
              Jadwal Tersedia
              <input
                name="availability"
                value={form.availability}
                onChange={handleChange}
                placeholder="Contoh: Senin - Jumat malam / Weekend / Fleksibel"
              />
            </label>

            <label className="full-field">
              Minat Belajar
              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="React, UI Design, Database"
              />
            </label>

            <label className="full-field">
              Bio
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <button className="primary-button full-field" type="submit">
              Simpan Perubahan
            </button>

            <button
              className="ghost-button full-field"
              type="button"
              onClick={() => {
                setEditing(false);
                setPreviewPhoto(user?.profilePhoto || '');
                setForm({
                  name: user?.name || '',
                  username: user?.username || '',
                  university: user?.university || '',
                  studyProgram: user?.studyProgram || '',
                  interests: interestsToInputString(user?.interests),
                  skillLevel: user?.skillLevel || 'Pemula',
                  bio: user?.bio || '',
                  learningMode: user?.learningMode || '',
                  availability: user?.availability || '',
                  profilePhoto: user?.profilePhoto || ''
                });
              }}
            >
              Batal Edit
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default Profile;