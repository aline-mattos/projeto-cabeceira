import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { EventModule } from '../../shared/modules/event.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EventModule,
    JwtModule.register({
      secret: '01932033-4251-73cb-b46d-66541e1c40b8',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthModule],
  exports: [AuthModule],
})
export class AuthModule {}
