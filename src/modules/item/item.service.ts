import { Injectable } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { StorageService } from 'src/storage/storage.service';
import { CreateItemDTO } from './dtos/create-item.dto';
import { Item } from './item.entity';
import { ItemMapper } from './mappers/item.mapper';
import { UpdateItemDTO } from './dtos/update-item.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';

