import { AppCheckToken, CustomProviderOptions } from 'firebase/app-check';
import type { Challenge, Solution } from 'altcha-lib/types';
export interface IAltchaProviderOptionsConfig {
    appId: string;
    createAltchaChallengeUrl: string;
    createAppCheckTokenUrl: string;
}
export declare class AltchaProviderOptions implements CustomProviderOptions {
    readonly config: IAltchaProviderOptionsConfig;
    constructor(config: IAltchaProviderOptionsConfig);
    getToken(): Promise<AppCheckToken>;
    createAltchaChallenge(): Promise<Challenge>;
    createAppCheckToken(challenge: Challenge, solution: Solution): Promise<AppCheckToken>;
}
