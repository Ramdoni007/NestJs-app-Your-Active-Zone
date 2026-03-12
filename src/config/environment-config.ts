import { environtmentConstant } from "src/constants/environtment.constant"
import { IAWSEnvironment } from "src/interfaces/aws.interface"
import { AwsUtil } from "src/utils/aws.util"
import fs from 'fs'
import { ConfigService } from "@nestjs/config"
import { config } from "process"

let jsonValue: any = {} 

export default async (): Promise<IAWSEnvironment> => {
    if ( process.env.NODE_ENV !== environtmentConstant.env.LOCAL) {
        const ssm: AwsUtil = new AwsUtil()
        const result: IAWSEnvironment = await ssm.getParameterStoreValue() 
        jsonValue = result
        return result
    }else { 
        const config: string = fs.readFileSync('config.json', 'utf-8')
        const result: IAWSEnvironment = JSON.parse(config) as IAWSEnvironment 
        jsonValue = result
        return result
    }
}

export const getSecretValue = (configService: ConfigService): Partial<IAWSEnvironment> => {
    const environments: any = JSON.parse(JSON.stringify(jsonValue))    
    const result: Partial<IAWSEnvironment> = {}

    Object.keys(environments).forEach(key => {
      const dataType = typeof environments[key]
      result[key] = configService.get<typeof dataType>(key)
    })
    return result
}