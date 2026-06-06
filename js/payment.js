/* 
========================================================================
   ABC Computer Training Centre - Interactive Payment Portal
   Developer: Antigravity
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const paymentInputSection = document.getElementById('payment-input-section');
  const paymentQrSection = document.getElementById('payment-qr-section');
  
  const paymentForm = document.getElementById('payment-amount-form');
  const paymentAmountInput = document.getElementById('payment-amount');
  
  const qrAmountDisplay = document.getElementById('qr-amount-display');
  const btnWaConfirmQr = document.getElementById('btn-wa-confirm-qr');
  
  let paymentAmount = 500;

  // Handle amount form submit
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = parseInt(paymentAmountInput.value, 10);
      if (isNaN(val) || val <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
      }
      paymentAmount = val;
      startPaymentFlow();
    });
  }

  function startPaymentFlow() {
    // Set amount in display
    if (qrAmountDisplay) {
      qrAmountDisplay.textContent = paymentAmount;
    }
    
    // Update WhatsApp pre-filled confirmation URLs
    const waText = `Hello Faculty, I have paid ₹${paymentAmount} successfully via UPI QR code. Please verify and confirm my payment.`;
    const waUrl = `https://wa.me/918827512123?text=${encodeURIComponent(waText)}`;
    
    if (btnWaConfirmQr) {
      btnWaConfirmQr.href = waUrl;
    }
    
    // Switch view
    paymentInputSection.style.display = 'none';
    paymentQrSection.style.display = 'block';
  }
});
