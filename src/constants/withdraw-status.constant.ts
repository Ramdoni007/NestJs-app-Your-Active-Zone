export const withdrawStatusConstant = {
    PENDING: 100,
    APPROVED: 200,
    REJECTED: 300,
};
export const withdrawStatusStringConstant = {
    PENDING: 'sedang di proses',
    APPROVED: 'sudah di transfer',
    REJECTED: 'gagal di transfer',

};

export function getWithdrawStatus (status: string): number {
    switch (status.toLowerCase()) {
        case 'pending': return withdrawStatusConstant.PENDING;
        case 'approved': return withdrawStatusConstant.APPROVED;
        case 'rejected': return withdrawStatusConstant.REJECTED;
        default: 
        throw new Error('invalid withdraw status');
    }
    
}