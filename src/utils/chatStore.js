import { consultationApi } from '../api/consultationApi';

const CHAT_PREFIX = 'adalat_chat_msgs_';
const TIMER_PREFIX = 'adalat_timer_start_';

export const getChatMessages = (consultationId) => {
  if (!consultationId) return [];
  try {
    const raw = localStorage.getItem(`${CHAT_PREFIX}${consultationId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}

  return [
    {
      id: 1,
      sender: 'CUSTOMER',
      text: 'Hello Advocate, I have submitted my legal intake details and AI assessment report. Please advise.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
};

export const sendChatMessage = async (consultationId, sender, text) => {
  if (!consultationId || !text.trim()) return [];

  // 1. Post directly to MySQL Database via backend REST API
  try {
    if (sender === 'CUSTOMER') {
      await consultationApi.sendConsultationMessageCustomer(consultationId, text);
    } else {
      await consultationApi.sendConsultationMessageLawyer(consultationId, text);
    }
  } catch (e) {
    console.warn('Backend REST API save error:', e);
  }

  // 2. Update local state & trigger cross-tab realtime sync
  const current = getChatMessages(consultationId);
  const newMsg = {
    id: Date.now(),
    sender,
    text: text.trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const updated = [...current, newMsg];
  try {
    localStorage.setItem(`${CHAT_PREFIX}${consultationId}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('adalat_chat_update', { detail: { consultationId } }));
  } catch (e) {}

  return updated;
};

export const subscribeToChat = (consultationId, onUpdate, isLawyer = false) => {
  if (!consultationId) return () => {};

  const syncFromDb = async () => {
    try {
      const apiCall = isLawyer 
        ? consultationApi.getConsultationMessagesLawyer(consultationId)
        : consultationApi.getConsultationMessagesCustomer(consultationId);

      const res = await apiCall;
      const dbMsgs = res && res.data ? (res.data.data || res.data) : [];
      if (Array.isArray(dbMsgs) && dbMsgs.length > 0) {
        const formatted = dbMsgs.map(m => ({
          id: m.id,
          sender: m.senderType || 'CUSTOMER',
          text: m.message || m.text,
          timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
        }));
        localStorage.setItem(`${CHAT_PREFIX}${consultationId}`, JSON.stringify(formatted));
        onUpdate(formatted);
        return;
      }
    } catch (e) {}

    // Fallback to local store if DB returns empty
    const msgs = getChatMessages(consultationId);
    onUpdate(msgs);
  };

  syncFromDb();

  const handleUpdate = () => {
    const msgs = getChatMessages(consultationId);
    onUpdate(msgs);
  };

  const windowListener = (e) => {
    if (e.type === 'adalat_chat_update' && e.detail?.consultationId === consultationId) {
      handleUpdate();
    }
    if (e.type === 'storage' && e.key === `${CHAT_PREFIX}${consultationId}`) {
      handleUpdate();
    }
  };

  window.addEventListener('adalat_chat_update', windowListener);
  window.addEventListener('storage', windowListener);

  const intervalId = setInterval(syncFromDb, 2000);

  return () => {
    window.removeEventListener('adalat_chat_update', windowListener);
    window.removeEventListener('storage', windowListener);
    clearInterval(intervalId);
  };
};

export const resetConsultationTimer = (consultationId) => {
  if (!consultationId) return;
  const key = `${TIMER_PREFIX}${consultationId}`;
  localStorage.setItem(key, String(Date.now()));
};

export const getSharedTimerSeconds = (consultationId, totalDurationSeconds = 120) => {
  if (!consultationId) return totalDurationSeconds;
  const key = `${TIMER_PREFIX}${consultationId}`;
  try {
    let startTime = localStorage.getItem(key);
    if (!startTime) {
      startTime = String(Date.now());
      localStorage.setItem(key, startTime);
    }
    const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
    const remaining = totalDurationSeconds - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  } catch (e) {
    return totalDurationSeconds;
  }
};
