export class AccountRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    emailOptin: boolean;
    password: string;
    phone: string;
    acceptsPhoneTerms: boolean;
    prefersPushNotification?: boolean;
    prefersEmailNotification?: boolean;
}
