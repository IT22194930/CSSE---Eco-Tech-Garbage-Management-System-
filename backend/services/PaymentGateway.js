//This is mock payment gateway to simulate real payment gateway
class PaymentGateway {

    static instance;
    paymentIntentsStore = new Map;

    constructor() {
        if (PaymentGateway.instance) {
            throw new Error("Cannot instantiate directly. Use PaymentGateway.getInstance() instead.")
        }
    }

    static getInstance() {
        if (!PaymentGateway.instance) {
            PaymentGateway.instance = new PaymentGateway();
        }
        return PaymentGateway.instance;
    }

    createPaymentIntent(userId, amount, currency) {
        // Generate a simple mock clientSecret
        const clientSecret = 'mock_garbage_management_system' + Math.random().toString(36).substr(2, 10) +'_'+userId;

        // Store the client secret with its associated payment data
        const paymentDetail = {
            amount: amount,
            currency: currency,
            status: 'requires_payment_method'
        };

        this.paymentIntentsStore.set(clientSecret, paymentDetail);

        return clientSecret;
    }
    confirmPayment(clientSecret, isValidCardDetail) {
        // Check if the clientSecret exists in the store
        if (paymentIntentsStore[clientSecret]) {
            if (isValidCardDetail) {
                // Update the payment status to 'succeeded'
                paymentIntentsStore[clientSecret].status = 'succeeded';
                return 'succeeded';
            } else {
                // Update the payment status to 'failed'
                paymentIntentsStore[clientSecret].status = 'failed';
                return 'failed';
            }
        } else {
            // Invalid clientSecret provided
            return 'failed';
        }
    }

    validateCardDetails(cardNumber, expiryDate, cvv) {
        return validateCardNumber(cardNumber) && validateExpiryDate(expiryDate) && validateCVV(cvv);
    }


}

module.exports = PaymentGateway;

// Luhn Algorithm for card number validation
const validateCardNumber = (cardNumber) => {
    // Check if card number contains only digits and is between 13 to 19 digits long
    if (!/^\d{13,19}$/.test(cardNumber)) {
        return false;
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

// Expiry date validation in "MM/YY" format
const validateExpiryDate = (expiryDate) => {
    // Check if expiry date matches the "MM/YY" format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        return false;
    }

    const [month, year] = expiryDate.split('/').map(Number);
    if (month < 1 || month > 12) {
        return false;
    }

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    // Check if the expiration year is in the future or current year and month
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }

    return true;
}

// CVV validation (3 or 4 digits)
const validateCVV = (cvv) => {
    // Check if CVV is either 3 or 4 digits long
    return /^\d{3,4}$/.test(cvv);
}
