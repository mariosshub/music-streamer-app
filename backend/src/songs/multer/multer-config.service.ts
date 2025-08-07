import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { GridFsStorage } from "multer-gridfs-storage/lib/gridfs";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    gridFsStorage: GridFsStorage;
    constructor(
        private configService: ConfigService
    ) {

        this.gridFsStorage = new GridFsStorage({
            url: configService.get('connectionUrl') as string,
        });   
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: this.gridFsStorage,
        };
    }
}