import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./socket/socket.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./users/users.service";
import { PayloadType } from "./auth/types/payload.type";
import { ConfigService } from "@nestjs/config";
import { OnModuleInit } from "@nestjs/common";
@WebSocketGateway({
    cors: { 
        origin: '*'  
    }
})
export class AppGateway implements OnModuleInit, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private socketService: SocketService,
        private jwtService: JwtService,
        private userService: UsersService, 
        private configService: ConfigService
    ){}

    onModuleInit() {
        const origin = this.configService.get('baseUrl')
        // checking the request each time
        this.server.engine.opts.allowRequest = (req, done) => {
             // applying CORS dynamically
            const originHeader = req.headers.origin;
            if (originHeader === origin) {
                done(null, true);
            } else {
                 done(`CORS error: The origin '${originHeader}' is not allowed. Expected origin: '${origin}'.`, false);
            }
        }
    }
    
    @WebSocketServer()
    server: Server
    
    afterInit(server: Server) {
        this.socketService.socket = server;
    }
    
    async handleConnection(socket: Socket, ...args: any[]) {
        console.log('Client connected', socket.id);
        const accessToken = socket.handshake.auth.token
        if(accessToken){
            try{
                let authenticatedUser: PayloadType = this.jwtService.verify(accessToken)
                await this.userService.findById(authenticatedUser.userId);

            } catch (error){
                // error in validating accesstoken or user not found
                // disconnect the socket
                socket.emit('exception', error);
                socket.disconnect(true)
            }
        }
        else{
            socket.emit('exception', "No auth token provided");
            socket.disconnect(true);
        }
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log('Client disconnected', socket.id);
    }
}