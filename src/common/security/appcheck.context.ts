import { Injectable } from '@nestjs/common';

@Injectable()
export class AppCheckContext {
    public clientName: string;
    public token: string;
}
