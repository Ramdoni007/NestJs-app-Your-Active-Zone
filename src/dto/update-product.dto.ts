import { IsNotEmpty, IsOptional, IsString, Validate, ValidateIf } from "class-validator";
import { typeConstant } from "src/constants/type.constant";
import { ProductDto } from "./product.dto";

export class CreateProductDto extends ProductDto { 
    @IsString()
    @IsOptional()
    image_key:string

    @IsString()
    @IsOptional()
    @ValidateIf(o => o.type_code === typeConstant.EBOOK)
    ebook_link:string
}