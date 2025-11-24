import React, { useEffect, useRef } from 'react';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle = {
  width: '90%',
  maxWidth: 720,
  maxHeight: '80vh',
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const titleStyle = { margin: 0, fontSize: 18, fontWeight: 600 };

const closeBtnStyle = {
  border: 'none',
  background: 'transparent',
  fontSize: 18,
  cursor: 'pointer',
  padding: 6,
  lineHeight: 1
};

const contentStyle = {
  padding: 20,
  overflow: 'auto',
  lineHeight: 1.6,
  fontSize: 14
};

const footerStyle = {
  padding: 12,
  borderTop: '1px solid #eee',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8
};

const btnStyle = {
  padding: '8px 14px',
  fontSize: 14,
  borderRadius: 6,
  cursor: 'pointer',
  border: '1px solid transparent'
};

const cancelBtnStyle = {
  ...btnStyle,
  background: '#fff',
  borderColor: '#d1d5db',
  color: '#111827'
};

const agreeBtnStyle = {
  ...btnStyle,
  background: '#2563eb',
  color: '#fff',
  borderColor: '#2563eb'
};

export default function TaCModal({
  open,
  onClose = () => {},
  onAgree = () => {},
  title = 'Terms & Conditions',
  agreeText = 'I Agree',
  cancelText = 'Cancel',
  children = null
}) {
  const contentRef = useRef(null);
  const agreeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const toFocus = agreeBtnRef.current || contentRef.current;
    toFocus && toFocus.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = [contentRef.current, agreeBtnRef.current].filter(Boolean);
        if (focusable.length === 0) return;
        const idx = focusable.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (idx === 0) {
            e.preventDefault();
            focusable[focusable.length - 1].focus();
          }
        } else {
          if (idx === focusable.length - 1) {
            e.preventDefault();
            focusable[0].focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={overlayStyle}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div role="dialog" aria-modal="true" aria-labelledby="tac-title" style={modalStyle}>
        <header style={headerStyle}>
          <h2 id="tac-title" style={titleStyle}>
            {title}
          </h2>
          <button aria-label="Close terms and conditions" style={closeBtnStyle} onClick={onClose}>
            ×
          </button>
        </header>

        <div ref={contentRef} tabIndex={0} style={contentStyle}>
          {children || (
            <>
              <p>
                Welcome! Please read these Terms and Conditions ("Terms") carefully before using
                this service. By accessing or using the service you agree to be bound by these
                Terms.
              </p>

              <h3>1. Use of Service</h3>
              <p>
                You may use the service for lawful purposes only. You agree not to misuse the
                service or help anyone else do so.
              </p>

              <h3>2. Content</h3>
              <p>
                All content provided through the service is for informational purposes only. We make
                no warranties about the accuracy or reliability of the content.
              </p>

              <h3>3. Privacy</h3>
              <p>
                Your use of the service is also governed by our Privacy Policy which explains how we
                collect and use your information.
              </p>

              <h3>4. Termination</h3>
              <p>
                We may suspend or terminate access to the service if you violate these Terms or for
                any other reason.
              </p>

              <h3>5. Changes</h3>
              <p>
                We may modify these Terms from time to time. Continued use of the service after
                changes constitute acceptance of the new Terms.
              </p>

              <p style={{ marginTop: 12 }}>
                If you have questions, contact support. By clicking "{agreeText}" you acknowledge
                that you have read and agree to these Terms.
              </p>
            </>
          )}
        </div>

        <footer style={footerStyle}>
          <button style={cancelBtnStyle} onClick={onClose}>
            {cancelText}
          </button>
          <button ref={agreeBtnRef} style={agreeBtnStyle} onClick={onAgree}>
            {agreeText}
          </button>
        </footer>
      </div>
    </div>
  );
}
