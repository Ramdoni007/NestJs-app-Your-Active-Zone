import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class BaseRegisterDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9\s]+$/)
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    phone_number: string;


    @IsOptional()
    role?: string;

     @IsOptional()
    photo?: string | null;
}

export class  RegisterCreatorDto extends BaseRegisterDto {
    @IsNumber()
    @IsNotEmpty()
    job_id: number
}

export class  RegisterUserDto extends BaseRegisterDto {
    @IsNumber()
    @IsOptional()
    job_id: number
}