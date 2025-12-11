// src/pages/MomoReturnPage.jsx
import React, { useEffect, useState } from 'react';

export default function MomoReturnPage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId') || params.get('partnerOrderId') || params.get('order_id');
    const requestId = params.get('requestId') || params.get('request_id') || params.get('requestid');
    const resultCode = params.get('resultCode') || params.get('result_code') || params.get('status');

    const payload = { type: 'MOMO_REDIRECT', orderId, requestId, resultCode };

    // Try to postMessage to opener (preferred same-origin)
    (async () => {
      try {
        // gọi payment-service check-status (same origin)
        const resp = await fetch(`/api/payments/check-status?orderId=${encodeURIComponent(orderId)}&resultCode=${encodeURIComponent(resultCode)}`);
        let statusJson = null;
        if (resp.ok) statusJson = await resp.json();
        payload.paymentCheck = statusJson; // ví dụ { status: 'PAID' } hoặc { status: 'FAILED' }

      } catch (err) {
        payload.paymentCheck = { error: 'check-failed' };
      }

      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, window.location.origin);
          setTimeout(() => window.close(), 700);
          setInfo({ status: 'sent', payload });
          return;
        }
      } catch (e) {
        console.warn('postMessage failed', e);
      }

      // fallback lưu localStorage rồi show page
      try { localStorage.setItem('MOMO_REDIRECT_RESULT', JSON.stringify(payload)); } catch (e) { }
      setInfo({ status: 'no-opener', payload });
    })();

    // If opener not available (user opened link directly), store in localStorage for other tab to pick up
    try {
      localStorage.setItem('MOMO_REDIRECT_RESULT', JSON.stringify(payload));
    } catch (e) {
      console.warn('localStorage set failed', e);
    }

    setInfo({ status: 'no-opener', payload });
  }, []); // <-- no navigate dependency

  if (!info) return <div style={{ padding: 40 }}>Đang xử lý trả về MoMo...</div>;

  if (info.status === 'sent') {
    return (
      <div style={{ padding: 40 }}>
        <h3>Đã chuyển kết quả trả về trang trước</h3>
        <p>Tab này sẽ đóng trong giây lát. Nếu không đóng, bạn có thể quay lại trang thanh toán.</p>
        <button onClick={() => window.close()}>Đóng</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h3>Không tìm thấy trang thanh toán gốc</h3>
      <p>Hệ thống đã lưu kết quả trả về. Quay lại trang đơn hàng hoặc trang thanh toán để xem kết quả.</p>
      <pre>{JSON.stringify(info.payload, null, 2)}</pre>
    </div>
  );
}
