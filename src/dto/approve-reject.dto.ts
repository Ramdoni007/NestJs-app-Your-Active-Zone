import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";


export class ApproveRejectResponse {
    @IsNumber()
    @IsNotEmpty()
    status: number

    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => o.status === 300)
    note: string

    @IsBoolean()
    @IsOptional()
    is_withdraw: boolean

    @IsString()
    @ValidateIf(o => o.is_withdraw === true)
    prof_image_key: string


}