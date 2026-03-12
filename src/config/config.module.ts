import { Module } from '@nestjs/common';
import environmentConfig from './environment-config';
import { ConfigModule as ConfigModuleAlias } from '@nestjs/config';
@Module({
    imports: [
        ConfigModuleAlias.forRoot({
            isGlobal: true,
            load: [environmentConfig],
        }),
    ],
})
export class ConfigModule {}
