import { Request, Response } from 'express';
import { Restaurante } from '../restaurante.entity';

export interface RestauranteRequest extends Request {
  params: {
    id?: string;
  };
}

export interface RestauranteResponse extends Response {
  locals: {
    restaurante?: Restaurante;
  };
}
