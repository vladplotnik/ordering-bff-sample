import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AccountRegistrationData, UserAccount } from '../models';
import { StoreService } from '../services';

@Controller('accounts')
@ApiTags('account')
export class AccountController {
    public constructor(private readonly storeService: StoreService) {}

    @Post('register')
    @ApiBody({
        type: AccountRegistrationData,
    })
    @ApiOperation({ summary: 'Register user account' })
    @ApiResponse({ status: HttpStatus.OK, type: UserAccount })
    public async getTheoreticalEta(
        @Body() accountData: AccountRegistrationData,
    ): Promise<UserAccount> {
        return this.storeService.registerAccount(accountData);
    }
}
