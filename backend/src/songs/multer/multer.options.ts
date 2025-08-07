import { HttpException, HttpStatus } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { extname } from "path";

export const multerOptions: MulterOptions = {
    limits:{
        fileSize: 12500000
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype === 'audio/mpeg') {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    }
}