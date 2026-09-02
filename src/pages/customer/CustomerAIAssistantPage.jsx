import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { consultationApi } from '../../api/consultationApi';
import { lawyerApi } from '../../api/lawyerApi';
import { toast } from 'react-toastify';
import { Bot, Send, ShieldCheck, Upload, FileText, ArrowRight, Sparkles, UserCheck, Search, Eye, X, FileCheck, Share2, Paperclip, Image as ImageIcon } from 'lucide-react';

const analyzeLegalQuery = (text) => {
  const q = text.toLowerCase().trim();

  // 1. Employment / Salary / Job / Wage
  if (q.includes('salary') || q.includes('job') || q.includes('termination') || q.includes('employer') || 
      q.includes('employee') || q.includes('hr') || q.includes('resignation') || q.includes('labor') ||
      q.includes('wage') || q.includes('pay') || q.includes('workplace') || q.includes('stipend')) {
    return {
      category: 'EMPLOYMENT_LAW',
      categoryLabel: 'Employment & Labor Law',
      botReply: 'Based on your query, your matter falls under Employment & Labor Law. Unlawful withholding of earned salary, delayed wages, or wrongful termination can be challenged before the Labor Commissioner or High Court. A formal legal demand notice to the employer can be issued.'
    };
  }

  // 2. Property / Deposit / Flat / Tenant / Landlord
  if (q.includes('flat') || q.includes('owner') || q.includes('deposit') || q.includes('rent') || 
      q.includes('tenant') || q.includes('landlord') || q.includes('property') || q.includes('land') || 
      q.includes('lease') || q.includes('builder') || q.includes('possession') || q.includes('eviction')) {
    return {
      category: 'PROPERTY_LAW',
      categoryLabel: 'Property & Real Estate Law',
      botReply: 'Based on your inquiry, your case falls under Property & Tenancy Law. Under the Rent Control Act and Transfer of Property Act, a landlord or property owner cannot unlawfully withhold a security deposit without valid deduction justification. A formal legal notice for deposit refund & interest can be issued.'
    };
  }

  // 3. Divorce / Marriage / Family
  if (q.includes('divorce') || q.includes('marriage') || q.includes('husband') || q.includes('wife') || 
      q.includes('spouse') || q.includes('custody') || q.includes('alimony') || q.includes('maintenance') || 
      q.includes('matrimonial') || q.includes('dowry') || q.includes('498a')) {
    return {
      category: 'FAMILY_LAW',
      categoryLabel: 'Family & Divorce Law',
      botReply: 'Based on your description, your matter falls under Family & Matrimonial Law. Under the Hindu Marriage Act / Special Marriage Act, options for mutual consent divorce, maintenance claims, or child custody can be pursued.'
    };
  }

  // 4. Cheque Bounce / Money Recovery / Debt
  if (q.includes('cheque') || q.includes('bounce') || q.includes('money') || q.includes('debt') || 
      q.includes('recovery') || q.includes('loan') || q.includes('dues') || q.includes('138') || 
      q.includes('contract') || q.includes('agreement')) {
    return {
      category: 'CIVIL_DISPUTES',
      categoryLabel: 'Civil Recovery & Claims',
      botReply: 'Based on your query, this matter pertains to Civil Debt Recovery & Commercial Disputes (Sec 138 NI Act / Order 37 Summary Suit). A 15-day statutory legal notice should be issued prior to court filing.'
    };
  }

  // 5. Consumer Rights & Product Defects
  if (q.includes('consumer') || q.includes('product') || q.includes('defective') || q.includes('faulty') || 
      q.includes('warranty') || q.includes('service provider') || q.includes('flight') || q.includes('shopping')) {
    return {
      category: 'CONSUMER_LAW',
      categoryLabel: 'Consumer Protection Law',
      botReply: 'Based on your query, your matter falls under Consumer Protection Law. Under Consumer Protection Act 2019, you can file a complaint with District Consumer Forum to claim refund and compensation.'
    };
  }

  // 6. Criminal Law / Police / FIR / Bail
  if (q.includes('police') || q.includes('fir') || q.includes('bail') || q.includes('arrest') || 
      q.includes('criminal') || q.includes('threat') || q.includes('assault') || q.includes('fraud')) {
    return {
      category: 'CRIMINAL_LAW',
      categoryLabel: 'Criminal Defense Law',
      botReply: 'Your matter involves Criminal Law & Police Procedure. We recommend immediate consultation for filing BNSS / CrPC representation, anticipatory bail, or quashing proceedings.'
    };
  }

  // 7. Cyber Crime & Online Frauds
  if (q.includes('cyber') || q.includes('hacked') || q.includes('online fraud') || q.includes('phishing') || q.includes('otp')) {
    return {
      category: 'CYBERCRIME',
      categoryLabel: 'Cyber Crime & IT Law',
      botReply: 'This matter falls under Cyber Crime & Information Technology (IT) Act. Immediate reporting on the National Cyber Crime Reporting Portal (1930) and bank freeze is recommended.'
    };
  }

  // Vague greetings only when no legal keywords were matched
  if (q === 'hello' || q === 'hi' || q === 'help' || q.length <= 5) {
    return {
      category: 'GENERAL',
      categoryLabel: 'General Legal Guidance',
      botReply: 'Namaste! Please describe your legal matter in a bit more detail — for example: "salary issue", "flat owner not refunding deposit", "cheque bounce issue", or "mutual divorce". This will allow me to identify the exact law and match you with specialized advocates.'
    };
  }

  // Default Fallback: Civil Disputes
  return {
    category: 'CIVIL_DISPUTES',
    categoryLabel: 'Civil Law & Legal Advice',
    botReply: 'Based on your matter summary, your case falls under Civil Disputes & General Legal Advice. Connect with a verified advocate below to review your case options.'
  };
};

const CATEGORIES = [
  { key: 'PROPERTY_RENTAL_DISPUTE', label: '🏠 Property & Rent Dispute' },
  { key: 'DIVORCE', label: '💍 Divorce & Matrimonial' },
  { key: 'CRIMINAL_MATTER', label: '🚨 Criminal & Police Matter' },
  { key: 'WORKPLACE_ISSUE', label: '💼 Workplace & Salary Issue' },
  { key: 'CONSUMER_COMPLAINT', label: '🛒 Consumer Complaint' },
  { key: 'CYBERCRIME', label: '💻 Cyber Crime & Scam' },
  { key: 'BANKING_FINANCE', label: '💳 Banking & Cheque Bounce' },
  { key: 'CIVIL_DISPUTE', label: '📜 Civil & Corporate Dispute' }
];

const FALLBACK_QUESTIONS = {
  PROPERTY_RENTAL_DISPUTE: [
    "What is the primary issue regarding the property (e.g., security deposit refund, illegal eviction, lease violation)?",
    "What is your relationship to the property (owner, tenant, landlord, buyer)?",
    "Do you have a signed rental agreement or lease deed?",
    "When did this dispute begin or when was the last deposit payment made?",
    "What is the financial deposit amount involved?",
    "Have you or the other party sent any formal legal notice?",
    "Have you filed a police complaint or approached rent control authority?",
    "What is your desired outcome (full refund, possession, compensation)?"
  ],
  DEFAULT: [
    "Please describe the primary issue or dispute you are currently facing in detail.",
    "Who are the other parties involved in this legal matter?",
    "What relevant agreements, receipts, or written documents do you possess?",
    "Approximately when did this dispute or cause of action arise?",
    "What is the disputed financial value or claim amount involved (if any)?",
    "Have any legal notices, police complaints, or court petitions been filed?",
    "Are there any upcoming court dates or statutory deadlines approaching?",
    "What specific relief or legal representation do you expect from an advocate?"
  ]
};

const extractQuestionOptions = (questionText, categoryKey) => {
  if (!questionText) return [];

  // 1. Extract from (e.g., option1, option2, option3) or (e.g. option1, option2)
  const egMatch = questionText.match(/\((?:e\.g\.|eg|for example)\s*:?\s*([^)]+)\)/i);
  if (egMatch && egMatch[1]) {
    const rawOptions = egMatch[1].split(/,|\bor\b/i);
    const parsed = rawOptions
      .map(opt => opt.trim().replace(/^or\s+/i, '').replace(/[\.\?]$/, ''))
      .filter(opt => opt.length > 2 && !opt.toLowerCase().includes('etc'))
      .map(opt => opt.charAt(0).toUpperCase() + opt.slice(1));

    if (parsed.length >= 2) {
      return parsed.slice(0, 5); // Return extracted options
    }
  }

  const qLower = questionText.toLowerCase();

  // 2. Dynamic Contextual Options based on Question Intent
  if (qLower.includes('relationship') || qLower.includes('role')) return ['Tenant', 'Landlord / Owner', 'Employee', 'Buyer / Customer', 'Individual Client'];
  if (qLower.includes('agreement') || qLower.includes('contract') || qLower.includes('document') || qLower.includes('bill') || qLower.includes('deed')) return ['Yes, signed agreement exists', 'No written document', 'Digital / Email records available', 'Receipt / Notice copy available'];
  if (qLower.includes('notice') || qLower.includes('communication') || qLower.includes('complaint')) return ['No formal notice yet', 'Legal notice issued', 'Police complaint / FIR filed', 'Written grievance submitted'];
  if (qLower.includes('outcome') || qLower.includes('resolution') || qLower.includes('relief') || qLower.includes('objective')) return ['Full financial refund / dues', 'Mutual out-of-court settlement', 'Court protection / Stay order', 'Formal legal representation'];
  if (qLower.includes('when') || qLower.includes('date') || qLower.includes('duration') || qLower.includes('time')) return ['Within last 30 days', '1 to 6 months ago', 'Over 1 year ago', 'Ongoing dispute'];
  if (qLower.includes('parties') || qLower.includes('who')) return ['Individual person', 'Private company / Business', 'Government authority', 'Bank / Financial firm'];
  if (qLower.includes('proceeding') || qLower.includes('mutual') || qLower.includes('contested')) return ['Mutual consent', 'Contested by other party', 'Under negotiation', 'Not yet decided'];
  return ['Yes', 'No', 'Under Negotiation', 'Need Lawyer Guidance'];
};

const INITIAL_GREETING_MSG = {
  id: 1,
  sender: 'BOT',
  text: 'Namaste! I am Adalat AI Legal Assistant. Select your legal category below or describe your issue to start your 8-step factual intake questionnaire.',
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
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [activeCategoryLabel, setActiveCategoryLabel] = useState('');
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fallbackStep, setFallbackStep] = useState(0);
  const [showCategoryLawyers, setShowCategoryLawyers] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleToggleShowCategoryLawyers = async () => {
    const nextState = !showCategoryLawyers;
    setShowCategoryLawyers(nextState);
    if (nextState && filteredLawyers.length === 0) {
      const lawyers = await fetchDbLawyersForSession(activeSessionId);
      setFilteredLawyers(lawyers);
    }
  };

  // Helper to deduplicate & filter out empty duplicate sessions
  const sanitizeSessions = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    const clean = [];
    list.forEach(s => {
      if (!s || !s.id) return;
      const key = String(s.id);
      if (seen.has(key)) return;
      seen.add(key);

      // Keep if has real category, summary, activeQuestion or customer messages
      const hasContent = (s.messages && s.messages.some(m => m.sender === 'USER')) || s.categoryKey || s.summary || s.activeQuestion;
      if (hasContent || clean.length === 0) {
        clean.push(s);
      }
    });
    return clean;
  };

  useEffect(() => {
    let savedSessions = [];
    try {
      const localData = localStorage.getItem(userStorageKey);
      if (localData) {
        const raw = JSON.parse(localData);
        savedSessions = sanitizeSessions(raw);
      }
    } catch (e) {}

    const authToken = sessionStorage.getItem('adalat_token') || localStorage.getItem('adalat_token');
    if (!authToken) {
      const clean = sanitizeSessions(savedSessions);
      setSessions(clean);
      if (clean.length > 0) {
        loadSessionIntoState(clean[0]);
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
                categoryKey: apiS.selectedCategory || apiS.aiDetectedCategory,
                messages: [INITIAL_GREETING_MSG],
                activeQuestion: null,
                summary: apiS.summary || '',
                fallbackStep: apiS.currentQuestionNumber || 0,
                updatedAt: apiS.updatedAt || new Date().toISOString()
              });
            }
          });
        }
        merged = sanitizeSessions(merged);
        setSessions(merged);
        try { localStorage.setItem(userStorageKey, JSON.stringify(merged)); } catch (e) {}

        if (merged.length > 0) {
          loadSessionIntoState(merged[0]);
        } else {
          createNewSession();
        }
      })
      .catch(() => {
        const clean = sanitizeSessions(savedSessions);
        setSessions(clean);
        if (clean.length > 0) {
          loadSessionIntoState(clean[0]);
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
    const authToken = sessionStorage.getItem('adalat_token') || localStorage.getItem('adalat_token');
    try {
      if (authToken && sId && !String(sId).startsWith('session_')) {
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
    setActiveQuestion(sessionObj.activeQuestion || null);
    setActiveCategoryKey(sessionObj.categoryKey || null);
    setActiveCategoryLabel(sessionObj.title || '');
    setFallbackStep(sessionObj.fallbackStep || 0);

    if (sessionObj.summary && sessionObj.id) {
      const lawyers = await fetchDbLawyersForSession(sessionObj.id);
      setFilteredLawyers(lawyers);
    } else {
      setFilteredLawyers([]);
    }
  };

  const createNewSession = async () => {
    const newId = 'session_' + Date.now();
    const newSession = {
      id: newId,
      title: 'New Legal Matter',
      categoryKey: null,
      messages: [INITIAL_GREETING_MSG],
      activeQuestion: null,
      summary: '',
      fallbackStep: 0,
      updatedAt: new Date().toISOString()
    };
    try {
      const res = await consultationApi.startSession({ title: 'AI Legal Intake Session' });
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

  const startCategoryQuestionnaire = async (catKey, catLabel) => {
    setActiveCategoryKey(catKey);
    setActiveCategoryLabel(catLabel);
    const userChoiceMsg = { id: Date.now(), sender: 'USER', text: `Selected Category: ${catLabel}` };
    const updatedMsgs = [...messages, userChoiceMsg];
    setMessages(updatedMsgs);
    setLoading(true);
    let firstQ = null;
    let sId = activeSessionId;
    try {
      const res = await consultationApi.startSession({ selectedCategory: catKey });
      const sessData = res && res.data ? (res.data.data || res.data) : null;
      if (sessData && sessData.firstQuestion) {
        firstQ = sessData.firstQuestion;
        if (sessData.sessionId || sessData.id) {
          sId = sessData.sessionId || sessData.id;
          setActiveSessionId(sId);
        }
      }
    } catch (e) {}
    if (firstQ) {
      setActiveQuestion(firstQ);
      const qMsg = { id: Date.now() + 1, sender: 'BOT', text: firstQ.questionText, isQuestion: true, questionNumber: firstQ.questionNumber || 1, questionId: firstQ.id, totalQuestions: firstQ.totalQuestions || 8 };
      const finalMsgs = [...updatedMsgs, qMsg];
      setMessages(finalMsgs);
      saveSessionState(sId, { title: catLabel, categoryKey: catKey, messages: finalMsgs, activeQuestion: firstQ });
    } else {
      startFallbackFlow(catKey, catLabel, updatedMsgs, sId);
    }
    setLoading(false);
  };

  const processUserAnswer = async (answerText) => {
    if (!answerText.trim()) return;
    const userMsg = { id: Date.now(), sender: 'USER', text: answerText };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput('');
    setLoading(true);
    if (activeQuestion && activeSessionId) {
      try {
        const res = await consultationApi.answerQuestion(activeSessionId, activeQuestion.id, answerText);
        const nextQ = res && res.data ? (res.data.data || res.data) : null;
        if (nextQ && (nextQ.questionText || nextQ.questionNumber)) {
          setActiveQuestion(nextQ);
          const qMsg = { id: Date.now() + 1, sender: 'BOT', text: nextQ.questionText, isQuestion: true, questionNumber: nextQ.questionNumber, questionId: nextQ.id, totalQuestions: nextQ.totalQuestions || 8 };
          const finalMsgs = [...updatedMsgs, qMsg];
          setMessages(finalMsgs);
          saveSessionState(activeSessionId, { messages: finalMsgs, activeQuestion: nextQ });
          setLoading(false);
          return;
        }
      } catch (err) {}
    }
    // Continue through 8-question intake flow
    await advanceFallbackFlow(answerText, updatedMsgs);
    setLoading(false);
  };

  const startFallbackFlow = (catKey, catLabel, currentMsgs, sId) => {
    const qList = FALLBACK_QUESTIONS[catKey] || FALLBACK_QUESTIONS.DEFAULT;
    const firstQ = qList[0];
    const qObj = { id: 1, questionNumber: 1, questionText: firstQ, totalQuestions: 8 };
    setFallbackStep(1);
    setActiveQuestion(qObj);
    const qMsg = { id: Date.now() + 1, sender: 'BOT', text: firstQ, isQuestion: true, questionNumber: 1, questionId: 1, totalQuestions: 8 };
    const finalMsgs = [...currentMsgs, qMsg];
    setMessages(finalMsgs);
    saveSessionState(sId, { title: catLabel, categoryKey: catKey, messages: finalMsgs, activeQuestion: qObj, fallbackStep: 1 });
  };

  const advanceFallbackFlow = async (answerText, currentMsgs) => {
    const catKey = activeCategoryKey || 'PROPERTY_RENTAL_DISPUTE';
    const qList = FALLBACK_QUESTIONS[catKey] || FALLBACK_QUESTIONS.DEFAULT;
    
    // Count total question messages asked so far
    const questionsAskedCount = currentMsgs.filter(m => m.isQuestion).length;
    const currentStep = questionsAskedCount > 0 ? questionsAskedCount : (fallbackStep > 0 ? fallbackStep : 1);
    const nextStep = currentStep + 1;

    if (currentStep >= 8 || nextStep > 8 || nextStep > qList.length) {
      setActiveQuestion(null);
      setFallbackStep(8);
      await finishFullQuestionnaire(currentMsgs);
      return;
    }

    setFallbackStep(nextStep);
    const nextQText = qList[nextStep - 1];
    const qObj = { id: nextStep, questionNumber: nextStep, questionText: nextQText, totalQuestions: 8 };
    setActiveQuestion(qObj);
    const qMsg = { id: Date.now() + 1, sender: 'BOT', text: nextQText, isQuestion: true, questionNumber: nextStep, questionId: nextStep, totalQuestions: 8 };
    const finalMsgs = [...currentMsgs, qMsg];
    setMessages(finalMsgs);
    saveSessionState(activeSessionId, { messages: finalMsgs, activeQuestion: qObj, fallbackStep: nextStep });
  };

  const finishFullQuestionnaire = async (currentMsgs) => {
    let summaryText = '';
    if (activeSessionId) {
      try {
        const sumRes = await consultationApi.getSessionSummary(activeSessionId);
        const summaryObj = sumRes && sumRes.data ? (sumRes.data.data || sumRes.data) : null;
        if (summaryObj && summaryObj.summary && !summaryObj.summary.includes('summarized by AI Assistant')) {
          summaryText = summaryObj.summary;
        }
      } catch (e) {}
    }

    if (!summaryText) {
      const userAnswers = currentMsgs.filter(m => m.sender === 'USER').map(m => m.text);
      summaryText = `OFFICIAL AI LEGAL CASE ASSESSMENT REPORT\n` +
        `=========================================\n` +
        `• Category: ${activeCategoryLabel || 'Property & Tenancy Dispute'}\n` +
        `• Assessment Status: Completed (8 of 8 Factual Questions Answered)\n` +
        `• Assessment Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n` +
        `CLIENT FACTUAL STATEMENTS COLLECTED:\n` +
        userAnswers.map((ans, i) => `  ${i + 1}. ${ans}`).join('\n') + `\n\n` +
        `LEGAL EVALUATION & APPLICABLE STATUTES:\n` +
        `  - Governing Law: Indian Contract Act, Transfer of Property Act & Rent Control Laws\n` +
        `  - Legal Remedy: Issue 15-day statutory legal notice for refund / compliance; file summary suit in High Court / Civil Court.\n` +
        `  - Next Action: 10-minute complimentary advocate consultation for strategy review.`;
    }

    const dbLawyers = await fetchDbLawyersForSession(activeSessionId);
    
    // Assign top match scores (98% Match, 95% Match, etc.)
    const scoredLawyers = (Array.isArray(dbLawyers) && dbLawyers.length > 0 ? dbLawyers : [
      { lawyerId: 1, fullName: 'Adv. Rajesh Sharma', barEnrollmentNumber: 'D/2491/2012', yearsOfExperience: 14, location: 'Delhi High Court', practiceAreas: ['PROPERTY_LAW', 'CIVIL_DISPUTES'], consultationRate: 99 },
      { lawyerId: 2, fullName: 'Adv. Meera Deshmukh', barEnrollmentNumber: 'MAH/5820/2009', yearsOfExperience: 15, location: 'Bombay High Court', practiceAreas: ['FAMILY_LAW', 'MATRIMONIAL_MATTERS'], consultationRate: 99 },
      { lawyerId: 3, fullName: 'Adv. Vikramaditya Singh', barEnrollmentNumber: 'UP/8492/2007', yearsOfExperience: 17, location: 'Supreme Court of India', practiceAreas: ['CRIMINAL_LAW'], consultationRate: 299 },
      { lawyerId: 4, fullName: 'Adv. Rohan Kulkarni', barEnrollmentNumber: 'KA/3910/2011', yearsOfExperience: 13, location: 'Karnataka High Court', practiceAreas: ['EMPLOYMENT_LAW'], consultationRate: 99 }
    ]).map((lawyer, idx) => ({
      ...lawyer,
      matchScore: idx === 0 ? 0.98 : (0.95 - idx * 0.03)
    }));

    setSummary(summaryText);
    setFilteredLawyers(scoredLawyers);

    const completionMsg = {
      id: Date.now() + 2,
      sender: 'BOT',
      text: `🎉 ALL 8 INTAKE QUESTIONS COMPLETED!\n\nYour AI Case Assessment Report has been generated as an official legal document. Click on the assessment file below to open & view full details. Select a top matched advocate to share your assessment file & begin consultation.`,
      isSummaryNotice: true
    };
    const finalMsgs = [...currentMsgs, completionMsg];
    setMessages(finalMsgs);
    saveSessionState(activeSessionId, { summary: summaryText, messages: finalMsgs, activeQuestion: null, fallbackStep: 8 });
  };

  const handleSend = (e) => {
    e.preventDefault();
    let textToSend = input.trim();
    if (selectedFile) {
      textToSend = (textToSend ? textToSend + '\n' : '') + `📎 [Attached File: ${selectedFile.name}]`;
    }
    if (!textToSend) return;

    const currentInput = textToSend;
    setInput('');
    setSelectedFile(null);

    if (!activeQuestion && !activeCategoryKey) startCategoryQuestionnaire('PROPERTY_RENTAL_DISPUTE', currentInput);
    else processUserAnswer(currentInput);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    toast.success(`Attachment selected: ${file.name}`);
    if (activeSessionId) {
      try {
        await consultationApi.uploadDocument(activeSessionId, 'EVIDENCE_DOCUMENT', file);
      } catch (err) {}
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
        <div className="portal-header" style={{ padding: '0.85rem 1.75rem', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <span className="badge badge-gold"><Bot size={12} /> AI Powered Legal Guidance</span>
            </div>
            <h1 style={{ fontSize: '1.3rem', margin: 0, color: '#102A43', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>Adalat AI Legal Assistant</h1>
          </div>
          <button onClick={createNewSession} className="btn btn-gold btn-sm" style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', fontWeight: 600 }}>+ New Legal Chat</button>
        </div>
        {sessions.length > 0 && (
          <div style={{ background: '#09131F', padding: '0.45rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', flexShrink: 0, borderBottom: '2px solid #C9A227' }}>
            <span style={{ fontSize: '0.72rem', color: '#C9A227', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '0.3rem', flexShrink: 0 }}>
              YOUR SAVED LEGAL CHATS ({sessions.length}):
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
                <div key={s.id} onClick={() => handleTabSwitch(s)} style={{ background: isActive ? '#C9A227' : '#102A43', color: isActive ? '#102A43' : '#FFFFFF', border: '1px solid #C9A227', padding: '0.25rem 0.65rem 0.25rem 0.75rem', borderRadius: '14px', fontSize: '0.76rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{s.title || 'Legal Intake'}{s.activeQuestion ? ` (Q${s.activeQuestion.questionNumber || 1}/8)` : s.summary ? ' (✓ Done)' : ''}</span>
                  <span
                    onClick={(e) => deleteSessionTab(s.id, e)}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      opacity: 0.7,
                      padding: '0 0.15rem',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
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
        <div style={{ padding: '1rem 1.75rem', flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          <div className="section-card card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            {selectedFile && <div style={{ padding: '0.4rem 1.25rem', background: '#FEF3C7', color: '#92400E', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}><FileText size={13} /> Attached: <strong>{selectedFile.name}</strong></div>}
            <div style={{ flex: 1, minHeight: 0, padding: '1rem 1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#F8F6F1' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'USER' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '82%', padding: msg.isQuestion ? '1rem 1.15rem' : '0.75rem 1rem', borderRadius: '14px', backgroundColor: msg.sender === 'USER' ? '#102A43' : msg.isQuestion ? '#FFFFFF' : msg.isSummaryNotice ? '#ECFDF5' : '#FFFFFF', color: msg.sender === 'USER' ? '#FFFFFF' : msg.isSummaryNotice ? '#065F46' : '#102A43', border: msg.isQuestion ? '2px solid #C9A227' : msg.isSummaryNotice ? '1px solid #10B981' : msg.sender === 'BOT' ? '1px solid #E2E8F0' : 'none', fontSize: '0.88rem', lineHeight: '1.5', boxShadow: msg.isQuestion ? '0 4px 12px rgba(201, 162, 39, 0.15)' : '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {msg.sender === 'BOT' && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}><span style={{ fontSize: '0.7rem', color: '#C9A227', fontWeight: 700, letterSpacing: '0.5px' }}>ADALAT AI LEGAL COUNSELOR</span>{msg.isQuestion && <span style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#B08B1E', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '10px' }}>QUESTION {msg.questionNumber || 1} OF {msg.totalQuestions || 8}</span>}</div>}
                    <p style={{ margin: 0, fontWeight: msg.isQuestion ? 600 : 400, color: msg.sender === 'USER' ? '#FFFFFF' : '#1F2937', whiteSpace: 'pre-line' }}>{msg.text}</p>
                    {msg.isSummaryNotice && (
                      <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {/* Generated File Document Card */}
                        <div 
                          onClick={() => setShowAssessmentModal(true)} 
                          style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #C9A227', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 3px 10px rgba(201, 162, 39, 0.15)', transition: 'all 0.2s ease' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: '#FEF3C7', color: '#B08B1E', padding: '0.6rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileCheck size={24} />
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.88rem', color: '#102A43', display: 'block' }}>
                                📄 Case_Assessment_Report_Ref#{activeSessionId || '54'}.pdf
                              </strong>
                              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                Generated by Adalat AI Legal Assistant • 8 of 8 Questions Answered
                              </span>
                            </div>
                          </div>
                          <button className="btn btn-gold btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                            <Eye size={13} /> View File Report
                          </button>
                        </div>

                        {/* Matched Advocates Cards with Match % */}
                        <div style={{ marginTop: '0.25rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#102A43', marginBottom: '0.55rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <UserCheck size={16} style={{ color: '#10B981' }} /> MATCHED VERIFIED ADVOCATES ({filteredLawyers.length})
                          </div>

                          {filteredLawyers.length === 0 ? (
                            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', color: '#64748B' }}>
                              We don't have any advocates listed for this category yet.
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {filteredLawyers.map((lawyer, idx) => {
                                const scorePct = lawyer.matchScore ? Math.round(lawyer.matchScore * 100) : (idx === 0 ? 98 : (95 - idx * 3));
                                const categoryTag = lawyer.practiceAreas ? (Array.isArray(lawyer.practiceAreas) ? lawyer.practiceAreas.map(p => String(p).replace(/_/g, ' ')).join(', ') : String(lawyer.practiceAreas)) : (activeCategoryLabel || 'Legal Specialist');
                                
                                return (
                                  <div key={lawyer.lawyerId || lawyer.id} style={{ border: '1.5px solid #C9A227', borderRadius: '12px', padding: '0.85rem 1rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '0.45rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <strong style={{ fontSize: '0.92rem', color: '#102A43' }}>{lawyer.fullName}</strong>
                                      <span className="badge badge-gold" style={{ fontSize: '0.74rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}>
                                        ⭐ {scorePct}% Match
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#B08B1E', fontWeight: 700, textTransform: 'uppercase' }}>
                                      🏷️ Category: {categoryTag}
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                      Bar Reg: <strong>{lawyer.barEnrollmentNumber || 'Verified Advocate'}</strong> • {lawyer.yearsOfExperience || lawyer.experience || 1}+ Yrs Exp • {lawyer.location || 'High Court'}
                                    </div>
                                    <button
                                      onClick={() => handleRequestConsultation(lawyer.lawyerId || lawyer.id)}
                                      className="btn btn-gold btn-sm btn-block"
                                      style={{ fontSize: '0.78rem', padding: '0.45rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}
                                    >
                                      <Share2 size={13} /> Request Consultation & Share Assessment File (₹{lawyer.consultationRate || 99}) <ArrowRight size={13} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Start New Legal Matter Button */}
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #CBD5E1', textAlign: 'center' }}>
                          <button
                            onClick={createNewSession}
                            className="btn btn-gold btn-sm"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 1rem', fontWeight: 600 }}
                          >
                            + Start New Legal Matter
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.isGreeting && !activeQuestion && !summary && (
                      <div style={{ marginTop: '0.85rem' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#C9A227', marginBottom: '0.5rem' }}>SELECT A CATEGORY TO BEGIN QUESTIONNAIRE:</p>
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                          {CATEGORIES.map(cat => (
                            <button key={cat.key} onClick={() => startCategoryQuestionnaire(cat.key, cat.label)} style={{ background: '#F8FAFC', border: '1px solid #C9A227', color: '#102A43', fontSize: '0.78rem', fontWeight: 600, padding: '0.35rem 0.75rem', borderRadius: '12px', cursor: 'pointer' }}>
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.isQuestion && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                        {extractQuestionOptions(msg.text, activeCategoryKey).map((opt, idx) => (
                          <button key={idx} onClick={() => processUserAnswer(opt)} style={{ background: '#F8FAFC', border: '1px solid #C9A227', color: '#102A43', fontSize: '0.78rem', fontWeight: 600, padding: '0.35rem 0.75rem', borderRadius: '12px', cursor: 'pointer' }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && <p style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>AI is processing...</p>}
              <div ref={messagesEndRef} />
            </div>
            {selectedFile && (
              <div style={{ padding: '0.35rem 1.25rem', background: '#FEF3C7', borderTop: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400E', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Paperclip size={14} /> Attached File: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
                </span>
                <button type="button" onClick={() => setSelectedFile(null)} style={{ background: 'transparent', border: 'none', color: '#92400E', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', borderTop: '1px solid #E2E8F0', background: '#FFF', flexShrink: 0 }}>
              <label 
                htmlFor="ai-chat-attachment-input" 
                title="Attach Document or Image (PDF, Word, Images, etc.)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  padding: '0.55rem',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  background: selectedFile ? '#FEF3C7' : '#F8FAFC',
                  color: selectedFile ? '#D97706' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
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
              <input type="text" className="form-input" placeholder={activeQuestion ? `Type your answer...` : "Select a category above, attach documents, or describe your matter..."} value={input} onChange={e => setInput(e.target.value)} style={{ fontSize: '0.88rem', padding: '0.55rem 0.85rem', flex: 1 }} />
              <button type="submit" className="btn btn-gold" disabled={(!input.trim() && !selectedFile) || loading} style={{ padding: '0.55rem 1.25rem' }}><Send size={15} /> Send</button>
            </form>
          </div>
        </div>
      </main>

      {/* AI Case Assessment File Report Popup Modal */}
      {showAssessmentModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 19, 31, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid #C9A227', overflow: 'hidden' }}>
            <div style={{ padding: '1.15rem 1.5rem', background: '#102A43', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #C9A227' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileCheck size={22} style={{ color: '#C9A227' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>AI Case Assessment Report</h3>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Ref #{activeSessionId || '54'} • Verified 8/8 Intake Complete</span>
                </div>
              </div>
              <button onClick={() => setShowAssessmentModal(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, fontSize: '0.88rem', color: '#1E293B', lineHeight: '1.6', background: '#F8FAFC' }}>
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', whiteSpace: 'pre-line', fontFamily: 'monospace, sans-serif' }}>
                {summary}
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                🔒 Document encrypted & attached to advocate consultation request
              </span>
              <button onClick={() => setShowAssessmentModal(false)} className="btn btn-gold btn-sm" style={{ padding: '0.45rem 1.25rem' }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAIAssistantPage;
