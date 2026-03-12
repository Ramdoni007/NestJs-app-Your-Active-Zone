import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UpdateUserProfileDto {
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
    phone_number: string;


    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string


}

export class  UpdateCreatorProfileDto extends UpdateUserProfileDto {
    @IsString()
    @IsNotEmpty()
    identity_number: string

    @IsOptional()
    @IsDateString({strict: true})
    birth_date: string

    @IsOptional()
    @IsNumber()
    job_id: number | null 

    @IsOptional()
    @Type(() => Number)
    @IsString()
    address: string
}

