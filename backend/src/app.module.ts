import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { validate } from 'src/config/env.validation';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { SongsModule } from './songs/songs.module';
import { CommentsModule } from './comments/comments.module';
import { AlbumsModule } from './albums/albums.module';
import { AppGateway } from './app.gateway';
import { SocketModule } from './socket/socket.module';
import { JwtModule } from '@nestjs/jwt';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: 
  [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        uri: configService.get('connectionUrl')
      })
    }),
    // moved from auth.module and made it global because its used also for authenticating socket connection
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {
              expiresIn: '1d' //expires after 1 day
          }
      }),
      inject: [ConfigService],
      global: true
    }),
    UsersModule,
    SongsModule,
    CommentsModule,
    VotesModule,
    AlbumsModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
