// Simulated MoMo Payment Service
// This simulates the MoMo payment flow for demo/testing purposes

const SIMULATION_CONFIG = {
  qrScanDelay: 3000, // Time to simulate QR code scanning (3 seconds)
  paymentProcessDelay: 2000, // Time to process payment (2 seconds)
  successRate: 0.98, // 98% success rate for simulation
};

class MoMoPaymentService {
  constructor() {
    this.pendingPayments = new Map();
    this.completedPayments = new Map();
  }

  // Generate a realistic MoMo transaction ID
  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `MOMO${timestamp}${random}`.slice(0, 20);
  }

  // Create a payment request
  createPaymentRequest(orderData) {
    const { total, orderNumber } = orderData;
    const transactionId = this.generateTransactionId();
    
    const paymentRequest = {
      transactionId,
      orderNumber,
      amount: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      qrCodeData: this.generateQRCodeData(transactionId, total, orderNumber),
    };

    this.pendingPayments.set(transactionId, paymentRequest);
    
    return {
      success: true,
      data: paymentRequest,
    };
  }

  // Generate QR code data (simulated)
  generateQRCodeData(transactionId, amount, orderNumber) {
    return {
      transactionId,
      phoneNumber: '0974945488',
      accountName: 'ANTA VIETNAM',
      amount,
      note: `ANTA ${orderNumber}`,
      bankCode: 'MOMO',
      qrContent: `2|99|0974945488|ANTA VIETNAM|${amount}|ANTA ${orderNumber}|0|0|${amount}`,
    };
  }

  // Simulate QR code being scanned
  simulateQRScan(transactionId, onProgress) {
    return new Promise((resolve) => {
      const payment = this.pendingPayments.get(transactionId);
      
      if (!payment) {
        resolve({
          success: false,
          error: 'Payment request not found',
        });
        return;
      }

      // Simulate scanning process
      if (onProgress) {
        onProgress({ status: 'scanning', message: 'Đang quét mã QR...' });
      }

      setTimeout(() => {
        if (onProgress) {
          onProgress({ status: 'detected', message: 'Đã phát hiện mã QR' });
        }

        // Simulate opening MoMo app
        setTimeout(() => {
          if (onProgress) {
            onProgress({ status: 'opening_app', message: 'Đang mở ứng dụng MoMo...' });
          }

          resolve({ success: true });
        }, 1000);
      }, SIMULATION_CONFIG.qrScanDelay);
    });
  }

  // Simulate payment processing
  async processPayment(transactionId, onProgress) {
    return new Promise((resolve) => {
      const payment = this.pendingPayments.get(transactionId);
      
      if (!payment) {
        resolve({
          success: false,
          error: 'Payment request not found',
        });
        return;
      }

      if (onProgress) {
        onProgress({ status: 'processing', message: 'Đang xử lý thanh toán...' });
      }

      setTimeout(() => {
        // Simulate success/failure based on success rate
        const isSuccess = Math.random() < SIMULATION_CONFIG.successRate;

        if (isSuccess) {
          payment.status = 'completed';
          payment.completedAt = new Date().toISOString();
          payment.momoTransactionId = `MT${Date.now()}`;
          
          this.completedPayments.set(transactionId, payment);
          this.pendingPayments.delete(transactionId);

          if (onProgress) {
            onProgress({ status: 'success', message: 'Thanh toán thành công!' });
          }

          resolve({
            success: true,
            data: {
              transactionId: payment.transactionId,
              momoTransactionId: payment.momoTransactionId,
              amount: payment.amount,
              completedAt: payment.completedAt,
            },
          });
        } else {
          payment.status = 'failed';
          payment.failedAt = new Date().toISOString();
          payment.errorMessage = 'Số dư không đủ';

          if (onProgress) {
            onProgress({ status: 'failed', message: 'Thanh toán thất bại. Vui lòng thử lại.' });
          }

          resolve({
            success: false,
            error: 'Số dư không đủ hoặc giao dịch bị từ chối',
          });
        }
      }, SIMULATION_CONFIG.paymentProcessDelay);
    });
  }

  // Auto-process payment (simulates user completing payment on their phone)
  async autoProcessPayment(transactionId, onProgress) {
    // First simulate QR scan
    const scanResult = await this.simulateQRScan(transactionId, onProgress);
    
    if (!scanResult.success) {
      return scanResult;
    }

    // Then simulate payment processing
    return await this.processPayment(transactionId, onProgress);
  }

  // Check payment status
  checkPaymentStatus(transactionId) {
    const pending = this.pendingPayments.get(transactionId);
    const completed = this.completedPayments.get(transactionId);
    
    if (completed) {
      return {
        success: true,
        status: 'completed',
        data: completed,
      };
    }
    
    if (pending) {
      return {
        success: true,
        status: pending.status,
        data: pending,
      };
    }
    
    return {
      success: false,
      status: 'not_found',
      error: 'Payment not found',
    };
  }

  // Cancel payment
  cancelPayment(transactionId) {
    const payment = this.pendingPayments.get(transactionId);
    
    if (payment) {
      payment.status = 'cancelled';
      payment.cancelledAt = new Date().toISOString();
      this.pendingPayments.delete(transactionId);
      
      return {
        success: true,
        message: 'Payment cancelled',
      };
    }
    
    return {
      success: false,
      error: 'Payment not found or already completed',
    };
  }

  // Get payment details
  getPaymentDetails(transactionId) {
    return this.checkPaymentStatus(transactionId);
  }
}

// Export singleton instance
export const momoPaymentService = new MoMoPaymentService();
export default momoPaymentService;
