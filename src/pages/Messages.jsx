import { useEffect, useRef, useState } from 'react';
import api, { getErrorMessage } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  async function loadConversations() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations);
      if (!selectedPartner && response.data.conversations.length > 0) {
        setSelectedPartner(response.data.conversations[0].partner);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Percakapan gagal dimuat.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedPartner?._id) return;
    api.get(`/messages/${selectedPartner._id}`)
      .then((response) => setMessages(response.data.messages))
      .catch((err) => setError(getErrorMessage(err, 'Pesan gagal dimuat.')));
  }, [selectedPartner]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(event) {
    event.preventDefault();
    if (!draft.trim() || !selectedPartner?._id) return;

    const text = draft.trim();
    setDraft('');
    try {
      const response = await api.post(`/messages/${selectedPartner._id}`, { text });
      setMessages((current) => [...current, response.data.message]);
      loadConversations();
    } catch (err) {
      setError(getErrorMessage(err, 'Pesan gagal dikirim.'));
      setDraft(text);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <h2>Chat dan Diskusi</h2>
          <p>Diskusikan materi dengan partner yang sudah terhubung.</p>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <section className="chat-layout">
        <aside className="conversation-list">
          <h3>Daftar Chat</h3>
          {loading ? <div className="mini-loader">Memuat...</div> : null}
          {!loading && conversations.length === 0 ? <p className="muted">Belum ada partner diterima.</p> : null}
          {conversations.map((conversation) => {
            const partner = conversation.partner;
            const active = selectedPartner?._id === partner._id;
            return (
              <button key={partner._id} className={active ? 'conversation active' : 'conversation'} onClick={() => setSelectedPartner(partner)}>
                <span className="avatar tiny" style={{ backgroundColor: partner.avatarColor || '#426ca8' }}>{partner.name?.[0]?.toUpperCase()}</span>
                <span>
                  <strong>{partner.name}</strong>
                  <small>{conversation.lastMessage?.text || 'Mulai diskusi pertama'}</small>
                </span>
                {conversation.unreadCount > 0 ? <em>{conversation.unreadCount}</em> : null}
              </button>
            );
          })}
        </aside>

        <div className="chat-panel">
          {selectedPartner ? (
            <>
              <div className="chat-header">
                <div className="avatar small" style={{ backgroundColor: selectedPartner.avatarColor || '#426ca8' }}>{selectedPartner.name?.[0]?.toUpperCase()}</div>
                <div>
                  <strong>{selectedPartner.name}</strong>
                  <span>{selectedPartner.studyProgram}</span>
                </div>
              </div>
              <div className="message-area">
                {messages.map((message) => {
                  const mine = String(message.sender) === String(user.id);
                  return (
                    <div key={message._id} className={mine ? 'message-bubble mine' : 'message-bubble'}>
                      {message.text}
                    </div>
                  );
                })}
                <div ref={bottomRef}></div>
              </div>
              <form className="message-form" onSubmit={sendMessage}>
                <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Kirim pesan..." />
                <button className="primary-button" type="submit">Kirim</button>
              </form>
            </>
          ) : (
            <EmptyState title="Pilih percakapan" description="Terima permintaan partner terlebih dahulu agar dapat berdiskusi." />
          )}
        </div>
      </section>
    </div>
  );
}

export default Messages;
