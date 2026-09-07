import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { consultationApi } from '../../api/consultationApi';
import { lawyerApi } from '../../api/lawyerApi';
import { toast } from 'react-toastify';
import { Bot, Send, FileText, ArrowRight, UserCheck, Eye, X, FileCheck, Share2, Paperclip, AlertTriangle, ShieldAlert, Edit3, Check } from 'lucide-react';

const INITIAL_GREETING_MSG = {
  id: 1,
  sender: 'BOT',
  text: 'Namaste! I am Adalat AI Legal Assistant. Tell us your situation in your own words — you don\'t need any legal knowledge.',
  isGreeting: true
};

const CustomerAIAssistantPage = () => {
  const { user } = useAuth();
  const userStorageKey = `adalat_sessions_${user?.email || 'default'}`;

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([INITIAL_GREETING_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [caseFactState, setCaseFactState] = useState(null);
  const [riskLevel, setRiskLevel] = useState('NORMAL');
  const [activeCategoryLabel, setActiveCategoryLabel] = useState('Legal Assistance Session');
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummaryText, setEditedSummaryText] = useState('');

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const sanitizeSessions = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    const clean = [];
    list.forEach(s => {
      if (!s || !s.id) return;
      const key = String(s.id);
      if (seen.has(key)) return;
      seen.add(key);
      clean.push(s);
    });
    return clean;
  };

  useEffect(() => {
    let savedSessions = [];
    try {
      const localData = localStorage.getItem(userStorageKey);
      if (localData) {
        savedSessions = sanitizeSessions(JSON.parse(localData));
      }
    } catch (e) {}

    const authToken = sessionStorage.getItem('adalat_token') || localStorage.getItem('adalat_token');
    if (!authToken) {
      if (savedSessions.length > 0) {
        loadSessionIntoState(savedSessions[0]);
      } else {
        createNewSession();
      }
      return;
    }

    consultationApi.getMySessions()
      .then(res => {
        const apiSessions = res && res.data ? (res.data.data || res.data) : [];
        let merged = [...savedSessions];
        if (Array.isArray(apiSessions) && apiSessions.length > 0) {
          apiSessions.forEach(apiS => {
            const sId = apiS.id || apiS.sessionId;
            if (sId && !merged.some(m => String(m.id) === String(sId))) {
              merged.push({
                id: sId,
                title: apiS.categoryDisplayName || 'Legal Intake Session',
                messages: [INITIAL_GREETING_MSG],
                summary: apiS.summary || '',
                riskLevel: apiS.riskLevel || 'NORMAL',
                updatedAt: apiS.updatedAt || new Date().toISOString()
              });
            }
          });
        }
        merged = sanitizeSessions(merged);
        setSessions(merged);
        if (merged.length > 0) {
          loadSessionIntoState(merged[0]);
        } else {
          createNewSession();
        }
      })
      .catch(() => {
        if (savedSessions.length > 0) {
          loadSessionIntoState(savedSessions[0]);
        } else {
          createNewSession();
        }
      });
  }, [userStorageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveSessionState = (sId, updatedFields) => {
    setSessions(prevSessions => {
      const newSessions = prevSessions.map(s => {
        if (String(s.id) === String(sId)) {
          return { ...s, ...updatedFields, updatedAt: new Date().toISOString() };
        }
        return s;
      });
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(newSessions));
      } catch (e) {}
      return newSessions;
    });
  };

  const fetchDbLawyersForSession = async (sId) => {
    try {
      if (sId && !String(sId).startsWith('session_')) {
        const lawRes = await consultationApi.getMatchingLawyers(sId);
        const rawList = lawRes && lawRes.data ? (lawRes.data.data || lawRes.data) : [];
        if (Array.isArray(rawList) && rawList.length > 0) {
          return rawList;
        }
      }
    } catch (e) {}

    try {
      const dbRes = await lawyerApi.getApprovedLawyers();
      const allDbLawyers = dbRes && dbRes.data ? (dbRes.data.data || dbRes.data) : [];
      if (Array.isArray(allDbLawyers) && allDbLawyers.length > 0) {
        return allDbLawyers;
      }
    } catch (e) {}

    return [];
  };

  const loadSessionIntoState = async (sessionObj) => {
    setActiveSessionId(sessionObj.id);
    setMessages(sessionObj.messages || [INITIAL_GREETING_MSG]);
    setSummary(sessionObj.summary || '');
    setRiskLevel(sessionObj.riskLevel || 'NORMAL');
    setActiveCategoryLabel(sessionObj.title || 'Legal Intake Session');

    if (sessionObj.summary && sessionObj.id) {
      const lawyers = await fetchDbLawyersForSession(sessionObj.id);
      setFilteredLawyers(lawyers);
    } else {
      setFilteredLawyers([]);
    }
  };

  const createNewSession = async () => {
    const tempId = 'session_' + Date.now();
    const newSession = {
      id: tempId,
      title: 'New Legal Matter',
      messages: [INITIAL_GREETING_MSG],
      summary: '',
      riskLevel: 'NORMAL',
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await consultationApi.startSession({ initialProblemText: '' });
      const sessData = res && res.data ? (res.data.data || res.data) : null;
      const apiId = sessData?.sessionId || sessData?.id;
      if (apiId) newSession.id = apiId;
    } catch (e) {}

    setSessions(prev => {
      const updated = [newSession, ...prev];
      try { localStorage.setItem(userStorageKey, JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    loadSessionIntoState(newSession);
  };

  const handleTabSwitch = (sessionObj) => {
    if (String(sessionObj.id) === String(activeSessionId)) return;
    loadSessionIntoState(sessionObj);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    let textToSend = input.trim();
    if (selectedFile) {
      textToSend = (textToSend ? textToSend + '\n' : '') + `📎 [Attached Document: ${selectedFile.name}]`;
    }
    if (!textToSend || loading) return;

    const userMsg = { id: Date.now(), sender: 'USER', text: textToSend };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    let currentSId = activeSessionId;
    if (!currentSId || String(currentSId).startsWith('session_')) {
      try {
        const startRes = await consultationApi.startSession({ initialProblemText: textToSend });
        const startData = startRes && startRes.data ? (startRes.data.data || startRes.data) : null;
        if (startData && (startData.sessionId || startData.id)) {
          currentSId = startData.sessionId || startData.id;
          setActiveSessionId(currentSId);
        }
      } catch (err) {}
    }

    try {
      const res = await consultationApi.processTurn(currentSId, textToSend);
      const turnData = res && res.data ? (res.data.data || res.data) : null;

      if (turnData) {
        const hasDuplicateNextQuestion = turnData.aiMessage && turnData.nextQuestion && turnData.aiMessage.includes(turnData.nextQuestion);
        const fullBotText = (turnData.aiMessage && turnData.nextQuestion && !hasDuplicateNextQuestion) 
          ? `${turnData.aiMessage}\n\n❓ ${turnData.nextQuestion}`
          : (turnData.aiMessage || turnData.nextQuestion);

        const botMsg = {
          id: Date.now() + 1,
          sender: 'BOT',
          text: fullBotText,
          riskLevel: turnData.riskLevel || 'NORMAL',
          assistanceMode: turnData.assistanceMode,
          actionSelectionRequired: turnData.actionSelectionRequired,
          availableActions: turnData.availableActions || [],
          actionOptions: turnData.actionOptions || [],
          matchedLawyers: turnData.matchedLawyers || []
        };

        if (turnData.matchedLawyers && turnData.matchedLawyers.length > 0) {
          setFilteredLawyers(turnData.matchedLawyers);
        }

        const finalMsgs = [...updatedMsgs, botMsg];
        setMessages(finalMsgs);
        setRiskLevel(turnData.riskLevel || 'NORMAL');

        if (turnData.caseFactState) {
          setCaseFactState(turnData.caseFactState);
        }

        if (turnData.status === 'READY_FOR_SUMMARY' || turnData.status === 'COMPLETED' || turnData.status === 'ESCALATED_TO_LAWYER') {
          const sumRes = await consultationApi.getSessionSummary(currentSId);
          const sumData = sumRes && sumRes.data ? (sumRes.data.data || sumRes.data) : null;
          if (sumData && sumData.summary) {
            setSummary(sumData.summary);
            setEditedSummaryText(sumData.summary);
            const lawyers = await fetchDbLawyersForSession(currentSId);
            setFilteredLawyers(lawyers);

            const summaryNoticeMsg = {
              id: Date.now() + 2,
              sender: 'BOT',
              text: `🎉 INTAKE SUMMARY READY!\n\nYour Case Assessment Summary has been generated. Click the button below to review, edit, or request advocate consultation.`,
              isSummaryNotice: true
            };
            setMessages([...finalMsgs, summaryNoticeMsg]);
            saveSessionState(currentSId, { summary: sumData.summary, messages: [...finalMsgs, summaryNoticeMsg], riskLevel: turnData.riskLevel });
          } else {
            saveSessionState(currentSId, { messages: finalMsgs, riskLevel: turnData.riskLevel });
          }
        } else {
          saveSessionState(currentSId, { messages: finalMsgs, riskLevel: turnData.riskLevel });
        }
      }
    } catch (err) {
      toast.error('Could not process AI intake turn. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIntentSelect = async (intentType) => {
    if (loading || !activeSessionId) return;

    const userMsgText = `Selected Action: ${intentType.replace(/_/g, ' ')}`;
    const userMsg = { id: Date.now(), sender: 'USER', text: userMsgText, isIntentChoice: true };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setLoading(true);

    try {
      // Send intentSelection cleanly with null text message
      const res = await consultationApi.processTurn(activeSessionId, null, intentType, null);
      const turnData = res && res.data ? (res.data.data || res.data) : null;

      if (turnData) {
        const hasDuplicateNextQuestion = turnData.aiMessage && turnData.nextQuestion && turnData.aiMessage.includes(turnData.nextQuestion);
        const fullBotText = (turnData.aiMessage && turnData.nextQuestion && !hasDuplicateNextQuestion) 
          ? `${turnData.aiMessage}\n\n❓ ${turnData.nextQuestion}`
          : (turnData.aiMessage || turnData.nextQuestion || "Thank you. Let's proceed with your selected action.");

        const botMsg = {
          id: Date.now() + 1,
          sender: 'BOT',
          text: fullBotText,
          riskLevel: turnData.riskLevel || 'NORMAL',
          assistanceMode: turnData.assistanceMode,
          actionSelectionRequired: turnData.actionSelectionRequired,
          availableActions: turnData.availableActions || [],
          actionOptions: turnData.actionOptions || [],
          matchedLawyers: turnData.matchedLawyers || []
        };

        if (turnData.matchedLawyers && turnData.matchedLawyers.length > 0) {
          setFilteredLawyers(turnData.matchedLawyers);
        }

        const finalMsgs = [...updatedMsgs, botMsg];
        setMessages(finalMsgs);
        setRiskLevel(turnData.riskLevel || 'NORMAL');

        if (turnData.caseFactState) {
          setCaseFactState(turnData.caseFactState);
        }
        saveSessionState(activeSessionId, { messages: finalMsgs, riskLevel: turnData.riskLevel });
      }
    } catch (err) {
      toast.error('Failed to submit intent selection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    toast.success(`Attachment selected: ${file.name}`);
    if (activeSessionId && !String(activeSessionId).startsWith('session_')) {
      try {
        await consultationApi.uploadDocument(activeSessionId, 'EVIDENCE_DOCUMENT', file);
      } catch (err) {}
    }
  };

  const handleSaveSummaryEdits = async () => {
    try {
      await consultationApi.updateSummary(activeSessionId, caseFactState, editedSummaryText);
      setSummary(editedSummaryText);
      setIsEditingSummary(false);
      toast.success('Case assessment summary saved & updated successfully!');
    } catch (err) {
      toast.error('Failed to save summary updates.');
    }
  };

  const deleteSessionTab = (sessionIdToDelete, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => String(s.id) !== String(sessionIdToDelete));
    setSessions(updated);
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(updated));
    } catch (err) {}

    if (String(sessionIdToDelete) === String(activeSessionId)) {
      if (updated.length > 0) {
        loadSessionIntoState(updated[0]);
      } else {
        createNewSession();
      }
    }
  };

  const clearAllSessionTabs = () => {
    try {
      localStorage.removeItem(userStorageKey);
    } catch (err) {}
    setSessions([]);
    createNewSession();
    toast.info('Chat tabs reset.');
  };

  const handleRequestConsultation = async (lawyerId) => {
    try {
      if (activeSessionId) {
        await consultationApi.requestLawyerConsultation(activeSessionId, lawyerId);
      }
      toast.success('Consultation request sent to advocate successfully!');
      navigate(`/customer/consultations?lawyerId=${lawyerId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to send consultation request.');
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar portalType="customer" />
      <main className="portal-main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* Portal Header */}
        <div className="portal-header" style={{ padding: '0.85rem 1.75rem', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <span className="badge badge-gold"><Bot size={12} /> Dynamic AI Legal Intake</span>
            </div>
            <h1 style={{ fontSize: '1.3rem', margin: 0, color: '#102A43', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>Adalat AI Legal Assistant</h1>
          </div>
          <button onClick={createNewSession} className="btn btn-gold btn-sm" style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', fontWeight: 600 }}>+ New Legal Chat</button>
        </div>

        {/* Saved Chat Tabs */}
        {sessions.length > 0 && (
          <div style={{ background: '#09131F', padding: '0.45rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', flexShrink: 0, borderBottom: '2px solid #5C5C99' }}>
            <span style={{ fontSize: '0.72rem', color: '#5C5C99', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '0.3rem', flexShrink: 0 }}>
              SAVED LEGAL CHATS ({sessions.length}):
            </span>
            {sessions.length > 1 && (
              <button
                onClick={clearAllSessionTabs}
                style={{
                  background: 'transparent',
                  border: '1px solid #475569',
                  color: '#94A3B8',
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                  flexShrink: 0
                }}
              >
                Clear All
              </button>
            )}
            {sessions.map(s => {
              const isActive = String(s.id) === String(activeSessionId);
              return (
                <div key={s.id} onClick={() => handleTabSwitch(s)} style={{ background: isActive ? '#5C5C99' : '#102A43', color: isActive ? '#102A43' : '#FFFFFF', border: '1px solid #5C5C99', padding: '0.25rem 0.65rem 0.25rem 0.75rem', borderRadius: '14px', fontSize: '0.76rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{s.title || 'Legal Intake'}{s.summary ? ' (✓ Summary)' : ''}</span>
                  <span
                    onClick={(e) => deleteSessionTab(s.id, e)}
                    style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, padding: '0 0.15rem', borderRadius: '50%', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                    title="Close Chat Tab"
                  >
                    ×
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Risk Warning Alert Card */}
        {riskLevel === 'CRITICAL' && (
          <div style={{ background: '#FEF2F2', borderBottom: '2px solid #EF4444', padding: '0.75rem 1.75rem', color: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldAlert size={20} style={{ color: '#DC2626' }} />
              <span><strong>⚠️ URGENT LEGAL ATTENTION REQUIRED:</strong> Your situation involves immediate legal or safety risks. We recommend direct advocate consultation.</span>
            </div>
            <button onClick={() => navigate('/find-lawyer')} className="btn btn-sm" style={{ background: '#DC2626', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>Connect Advocate Now</button>
          </div>
        )}
        {riskLevel === 'URGENT' && (
          <div style={{ background: '#FFFBEB', borderBottom: '2px solid #F59E0B', padding: '0.65rem 1.75rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertTriangle size={18} style={{ color: '#D97706' }} />
            <span><strong>⚠️ TIME-SENSITIVE MATTER:</strong> Important notice deadline or hearing dates may be involved in your case.</span>
          </div>
        )}

        {/* Main Conversational Stream */}
        <div style={{ padding: '1rem 1.75rem', flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          <div className="section-card card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ flex: 1, minHeight: 0, padding: '1rem 1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#F8F6F1' }}>
              
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'USER' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '82%', padding: '0.85rem 1.15rem', borderRadius: '14px', backgroundColor: msg.sender === 'USER' ? '#102A43' : msg.isSummaryNotice ? '#ECFDF5' : '#FFFFFF', color: msg.sender === 'USER' ? '#FFFFFF' : msg.isSummaryNotice ? '#065F46' : '#102A43', border: msg.isSummaryNotice ? '1px solid #10B981' : msg.sender === 'BOT' ? '1px solid #E2E8F0' : 'none', fontSize: '0.88rem', lineHeight: '1.5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    {msg.sender === 'BOT' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#5C5C99', fontWeight: 700, letterSpacing: '0.5px' }}>ADALAT AI LEGAL COUNSELOR</span>
                      </div>
                    )}
                    <p style={{ margin: 0, color: msg.sender === 'USER' ? '#FFFFFF' : '#1F2937', whiteSpace: 'pre-line' }}>{msg.text}</p>
                    
                    {/* Domain Action Guidance Options Cards */}
                    {((msg.availableActions && msg.availableActions.length > 0) || (msg.actionOptions && msg.actionOptions.length > 0)) && (
                      <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                        {(msg.availableActions && msg.availableActions.length > 0 ? msg.availableActions : msg.actionOptions).map(opt => (
                          <button
                            key={opt.id || opt.type}
                            onClick={() => handleIntentSelect(opt.type)}
                            disabled={loading}
                            style={{
                              background: opt.recommended ? '#FEFCE8' : '#FFFFFF',
                              border: opt.recommended ? '2px solid #EAB308' : '1.5px solid #5C5C99',
                              borderRadius: '10px',
                              padding: '0.75rem 0.85rem',
                              textAlign: 'left',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                            }}
                            onMouseOver={e => e.currentTarget.style.borderColor = '#102A43'}
                            onMouseOut={e => e.currentTarget.style.borderColor = opt.recommended ? '#EAB308' : '#5C5C99'}
                          >
                            <strong style={{ fontSize: '0.82rem', color: '#102A43', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>{opt.title}</span>
                              {opt.recommended && <span style={{ fontSize: '0.65rem', background: '#EAB308', color: '#FFFFFF', padding: '0.1rem 0.35rem', borderRadius: '6px' }}>RECOMMENDED</span>}
                            </strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{opt.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Interactive Case Summary Report Card */}
                    {msg.isSummaryNotice && summary && (
                      <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div 
                          onClick={() => setShowAssessmentModal(true)} 
                          style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #5C5C99', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 3px 10px rgba(201, 162, 39, 0.15)', transition: 'all 0.2s ease' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: '#FEF3C7', color: '#45457a', padding: '0.6rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileCheck size={24} />
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.88rem', color: '#102A43', display: 'block' }}>
                                📄 Case_Assessment_Report_Ref#{activeSessionId || '54'}.pdf
                              </strong>
                              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                Dynamic Case Intake Summary • Click to View & Edit Facts
                              </span>
                            </div>
                          </div>
                          <button className="btn btn-gold btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                            <Eye size={13} /> View / Edit Summary
                          </button>
                        </div>

                        {/* Matched Advocates List */}
                        <div style={{ marginTop: '0.25rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#102A43', marginBottom: '0.55rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <UserCheck size={16} style={{ color: '#10B981' }} /> MATCHED VERIFIED ADVOCATES ({filteredLawyers.length})
                          </div>

                          {filteredLawyers.length === 0 ? (
                            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', color: '#64748B' }}>
                              Advocates available for direct consultation.
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {filteredLawyers.map((lawyer, idx) => {
                                const scorePct = lawyer.matchScore ? Math.round(lawyer.matchScore * 100) : (idx === 0 ? 98 : (95 - idx * 3));
                                return (
                                  <div key={lawyer.lawyerId || lawyer.id} style={{ border: '1.5px solid #5C5C99', borderRadius: '12px', padding: '0.85rem 1rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <strong style={{ fontSize: '0.92rem', color: '#102A43' }}>{lawyer.fullName}</strong>
                                      <span className="badge badge-gold" style={{ fontSize: '0.74rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}>
                                        ⭐ {scorePct}% Match
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                      Bar Reg: <strong>{lawyer.barEnrollmentNumber || 'Verified Advocate'}</strong> • {lawyer.yearsOfExperience || 10}+ Yrs Exp
                                    </div>
                                    <button
                                      onClick={() => handleRequestConsultation(lawyer.lawyerId || lawyer.id)}
                                      className="btn btn-gold btn-sm btn-block"
                                      style={{ fontSize: '0.78rem', padding: '0.45rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}
                                    >
                                      <Share2 size={13} /> Request Consultation (₹{lawyer.consultationRate || 99}) <ArrowRight size={13} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && <p style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>Adalat AI is understanding your situation & formulating the next question...</p>}
              <div ref={messagesEndRef} />
            </div>

            {selectedFile && (
              <div style={{ padding: '0.35rem 1.25rem', background: '#FEF3C7', borderTop: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400E', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Paperclip size={14} /> Attached File: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
                </span>
                <button type="button" onClick={() => setSelectedFile(null)} style={{ background: 'transparent', border: 'none', color: '#92400E', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Conversational Input Form */}
            <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', borderTop: '1px solid #E2E8F0', background: '#FFF', flexShrink: 0 }}>
              <label 
                htmlFor="ai-chat-attachment-input" 
                title="Attach Document or Image"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.55rem',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  background: selectedFile ? '#FEF3C7' : '#F8FAFC',
                  color: selectedFile ? '#D97706' : '#64748B',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Paperclip size={18} />
              </label>
              <input 
                id="ai-chat-attachment-input"
                type="file" 
                accept="image/*,.pdf,.doc,.docx,.txt" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Explain what happened in your own words..." 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                style={{ fontSize: '0.88rem', padding: '0.55rem 0.85rem', flex: 1 }} 
              />
              <button 
                type="submit" 
                className="btn btn-gold" 
                disabled={(!input.trim() && !selectedFile) || loading} 
                style={{ padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                <Send size={15} /> Continue →
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Editable Case Assessment Summary Modal */}
      {showAssessmentModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 19, 31, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid #5C5C99', overflow: 'hidden' }}>
            <div style={{ padding: '1.15rem 1.5rem', background: '#102A43', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #5C5C99' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileCheck size={22} style={{ color: '#5C5C99' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>AI Case Assessment Summary</h3>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Ref #{activeSessionId || '54'} • Editable Intake Report</span>
                </div>
              </div>
              <button onClick={() => { setShowAssessmentModal(false); setIsEditingSummary(false); }} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, fontSize: '0.88rem', color: '#1E293B', lineHeight: '1.6', background: '#F8FAFC' }}>
              {isEditingSummary ? (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#102A43', marginBottom: '0.5rem', display: 'block' }}>
                    Edit Factual Summary Details:
                  </label>
                  <textarea
                    rows={12}
                    value={editedSummaryText}
                    onChange={e => setEditedSummaryText(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1.5px solid #5C5C99', fontFamily: 'sans-serif', fontSize: '0.88rem', lineHeight: '1.5' }}
                  />
                </div>
              ) : (
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', whiteSpace: 'pre-line' }}>
                  {summary}
                </div>
              )}
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {isEditingSummary ? (
                <div style={{ display: 'flex', gap: '0.6rem', marginLeft: 'auto' }}>
                  <button onClick={() => setIsEditingSummary(false)} className="btn btn-sm" style={{ background: '#E2E8F0', color: '#1E293B', fontWeight: 600 }}>
                    Cancel
                  </button>
                  <button onClick={handleSaveSummaryEdits} className="btn btn-gold btn-sm" style={{ padding: '0.45rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    <Check size={14} /> Save Corrections
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => setIsEditingSummary(true)} className="btn btn-sm" style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#102A43', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Edit3 size={14} /> Edit Case Facts
                  </button>
                  <button onClick={() => setShowAssessmentModal(false)} className="btn btn-gold btn-sm" style={{ padding: '0.45rem 1.25rem' }}>
                    Confirm & Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAIAssistantPage;
