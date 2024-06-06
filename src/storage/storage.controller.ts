import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { StorageService } from './storage.service';

@Controller('/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get(':filename')
  async serveFile(@Param('filename') fileName: string, @Res() res: Response) {
    const file = this.storageService.getFileByName(fileName);

    res.sendFile(file);
  }
}
