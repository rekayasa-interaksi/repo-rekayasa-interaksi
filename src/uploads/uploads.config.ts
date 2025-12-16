import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'node:fs';

@Injectable()
export class UploadsConfigService implements MulterOptionsFactory {
  private uploadPath = './uploads'; // Default path

  setUploadPath(path: string) {
    this.uploadPath = path;
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      // storage: diskStorage({
      //   destination: (req, file, cb) => {
      //     if (!fs.existsSync(this.uploadPath)) {
      //       fs.mkdirSync(this.uploadPath, { recursive: true });
      //     }
      //     cb(null, this.uploadPath);
      //   },
      //   filename: (req, file, cb) => {
      //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      //     cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      //   },
      // }),
      storage: multer.memoryStorage(), // Store file in memory (RAM) before uploading
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    };
  }
}