import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UploadsService {
  private readonly apiUrl = process.env.SUPPORT_API_URL;
  private readonly apiKey = process.env.SUPPORT_API_KEY;
  private readonly MAX_SIZE = 3 * 1024 * 1024; // 3MB

  // ================== UPLOAD ==================

  private async uploadSingleFile(file: Express.Multer.File, directory: string) {
    if (file.size > this.MAX_SIZE) {
      throw new BadRequestException(`File ${file.originalname} melebihi batas ukuran 3MB`);
    }

    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });
    formData.append('directory', directory);

    const response = await axios.post(`${this.apiUrl}api/upload`, formData, {
      headers: {
        'x-api-key': this.apiKey,
        ...formData.getHeaders(),
      },
    });

    if (response.data.status !== 'success') {
      throw new BadRequestException('Gagal upload file');
    }

    return {
      image: response.data.data.path,
      signed_url: response.data.data.url,
    };
  }

  async saveFileData(files: { image?: Express.Multer.File[] }, directory: string): Promise<{ image: string; signed_url: string }> {
    if (!files.image || files.image.length === 0) {
      return { image: null, signed_url: null };
    }
    return await this.uploadSingleFile(files.image[0], directory);
  }

  async downloadImage(url: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const buffer = Buffer.from(response.data);

    const filename = url.split('/').pop() ?? 'default.png';
    const mimetype = response.headers['content-type'] ?? 'application/octet-stream';

    const file: Express.Multer.File = {
      fieldname: 'poster',
      originalname: filename,
      encoding: '7bit',
      mimetype,
      size: buffer.length,
      buffer,
      destination: '',
      filename,
      path: '',
      stream: null as any,
    };

    return file;
  }

  async saveSingleFile(file: Express.Multer.File, directory: string): Promise<{ image: string; signed_url: string }> {
    return await this.uploadSingleFile(file, directory);
  }

  async savesFileData(files: { image?: Express.Multer.File[] }, directory: string) {
    if (!files.image || files.image.length === 0) {
      return {};
    }

    for (const file of files.image) {
      if (file.size > this.MAX_SIZE) {
        throw new BadRequestException(`File ${file.originalname} melebihi batas ukuran 3MB`);
      }
    }

    const formData = new FormData();
    for (const file of files.image) {
      formData.append('files[]', file.buffer, { filename: file.originalname });
    }
    formData.append('directory', directory);

    const response = await axios.post(`${this.apiUrl}api/uploads`, formData, {
      headers: {
        'x-api-key': this.apiKey,
        ...formData.getHeaders(),
      },
    });

    if (response.data.status !== 'success') {
      throw new BadRequestException('Gagal upload multiple file');
    }

    const uploadedImages = response.data.data.map((f: any) => ({
      filePath: f.path,
      signedUrl: f.url,
    }));

    return { images: uploadedImages };
  }

  // ================== DELETE ==================

  async deleteFileData(filePath: string) {
    const response = await axios.delete(`${this.apiUrl}api/upload`, {
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        file_path: filePath,
      },
    });

    if (response.data.status !== 'success') {
      throw new BadRequestException('Gagal menghapus file');
    }

    return { success: true };
  }

  async deletesFileData(filePaths: string[]) {
    if (!filePaths || filePaths.length === 0) {
      throw new BadRequestException('No file paths provided for deletion.');
    }

    const response = await axios.delete(`${this.apiUrl}api/uploads`, {
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        file_paths: filePaths,
      },
    });

    if (response.data.status !== 'success') {
      throw new BadRequestException('Gagal menghapus multiple file');
    }

    return { success: true };
  }
}