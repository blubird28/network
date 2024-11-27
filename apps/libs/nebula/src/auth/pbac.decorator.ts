import { Request } from 'express';

import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { AccessCheckDto } from '../dto/access-check.dto';
import { ZeroOrMore } from '../utils/data/zeroOrMore';

import { PBAC_KEY } from './constants';

export type AccessCheckFunc = (request: Request) => ZeroOrMore<AccessCheckDto>;

export const PBAC = (checkFn: AccessCheckFunc) =>
  applyDecorators(SetMetadata(PBAC_KEY, checkFn), ApiSecurity('bearer'));
