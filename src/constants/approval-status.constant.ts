export const approvalStatusConstant = {
    PENDING: 100,
    APPROVED: 200,
    REJECTED: 300,
}

export const approvalStatusLabel = {
    [approvalStatusConstant.PENDING]: 'PENDING',
    [approvalStatusConstant.APPROVED]: 'APPROVED',
    [approvalStatusConstant.REJECTED]: 'REJECTED',
}

export const convertStatusToLabel = (status: number) => {
    return approvalStatusLabel[status] || 'Unknown Status';
}