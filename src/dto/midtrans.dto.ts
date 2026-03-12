import { ICustomerDetails, IExpiry, IItemsDetails, IMidtransTransactionDetails } from "src/interfaces/midtrans.interface";

export class MidtransDto {
    transaction_details: IMidtransTransactionDetails
    customer_details: ICustomerDetails
    items_details: IItemsDetails[]
    expiry: IExpiry
    enabled_payments?: string[]
}

