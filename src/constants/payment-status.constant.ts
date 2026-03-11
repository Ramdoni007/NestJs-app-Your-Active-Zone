export const paymentStatusConstant = {
    PENDING: 100,
    SETTLEMENT: 200,
    EXPIRED: 300,
};

export const paymentStatusLabel = {
    [paymentStatusConstant.PENDING]: 'Pending',
    [paymentStatusConstant.SETTLEMENT]: 'Settlement',
    [paymentStatusConstant.EXPIRED]: 'expired',
};

export function getPaymentStatus (status: string): number {
    switch (status.toLowerCase()) {
        case 'pending': return paymentStatusConstant.PENDING;
        case 'settlement': return paymentStatusConstant.SETTLEMENT;
        case 'expired': return paymentStatusConstant.EXPIRED;
        default: 
        throw new Error('invalid payment status');
    }
    
}