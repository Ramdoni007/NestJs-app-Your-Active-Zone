import { ArrayNotEmpty, IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductVoucherDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()  
    code: string;

    @IsNumber()
    @IsNotEmpty()
    percentage: number;

    @IsString()
    @IsNotEmpty()
    end_date: string;
    
    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;

    @IsArray()
    @IsNumber({},{each: true})
    @ArrayNotEmpty()
    product:number[]
}
export class ValidateProductVoucherDto { 
    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    product_id: string
}

export class WithdrawDto { 
    @IsNumber()
    @IsNotEmpty()
    total_amount: number

}