import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, CheckCircle, CreditCard, Lock } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  title = "Unlock Extended Consultation", 
  amount = "199.00", 
  lawyerName = "Advocate", 
  lawyerUpiId = "advocate@upi", 
  onPaymentSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('QR'); // 'QR' or 'SUCCESS'

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess({
            gatewayPaymentId: 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            amount: amount,
            lawyerName: lawyerName
          });
        }
      }, 1200);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content payment-modal-content">
        <div className="payment-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {step === 'QR' ? (
          <div className="payment-modal-body text-center">
            <div className="amount-header-box">
              <span className="pay-amount-label">Amount Payable:</span>
              <h2 className="pay-amount-val">₹{amount}</h2>
              <p className="pay-to-text">Direct payout to: <strong>{lawyerName}</strong> (UPI: <span style={{ color: '#C9A227', fontWeight: 700 }}>{lawyerUpiId || 'adalat.lawyer@upi'}</span>)</p>
            </div>

            <div className="qr-container-box" style={{ margin: '1.25rem 0' }}>
              <div className="qr-code-wrapper" style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '16px', border: '2px solid #C9A227', display: 'inline-block', boxShadow: '0 8px 24px rgba(201, 162, 39, 0.15)' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${lawyerUpiId || 'adalat.lawyer@upi'}&pn=${lawyerName || 'Advocate'}&am=${amount || '99'}&cu=INR&tn=Consultation%20Fee`)}`}
                  alt={`UPI QR Code for ${lawyerUpiId}`} 
                  style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto', borderRadius: '8px' }} 
                />
                <div style={{ marginTop: '0.6rem', fontWeight: 700, color: '#102A43', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <QrCode size={14} style={{ color: '#C9A227' }} /> Scan & Pay with any UPI App
                </div>
              </div>
              <p className="upi-apps-text" style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>
                Google Pay • PhonePe • Paytm • BHIM • Cred UPI
              </p>
            </div>

            <div className="payment-modal-actions">
              <button 
                onClick={handleSimulatePayment} 
                className="btn btn-gold btn-block btn-lg"
                disabled={loading}
              >
                {loading ? 'Confirming UPI Payment...' : 'I Have Paid — Continue Consultation'}
              </button>
            </div>

            <div className="trust-footer">
              <ShieldCheck size={14} /> 256-Bit SSL Secured Direct UPI Settlement
            </div>
          </div>
        ) : (
          <div className="payment-success-box text-center">
            <div className="success-icon-circle">
              <CheckCircle size={48} />
            </div>
            <h3>Payment Confirmed!</h3>
            <p>Your consultation with <strong>{lawyerName}</strong> has been successfully unlocked.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
