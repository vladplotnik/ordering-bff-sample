import {
    Inject,
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { getAppCheck } from 'firebase-admin/app-check';
import { AppCheckContext } from './appcheck.context';

@Injectable()
export class AppCheckGuard implements CanActivate {
    constructor(@Inject('AppCheckContext') private appCheckContext: AppCheckContext) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const clientName = request.headers['x-client-name'];
        const token = request.headers['x-appcheck-token'];

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            // Verify the token to ensure validity
            await getAppCheck().verifyToken(token);
            this.appCheckContext.clientName = clientName;
            this.appCheckContext.token = token;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }
}
