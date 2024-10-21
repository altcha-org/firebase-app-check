import { AppCheckToken, CustomProviderOptions } from 'firebase/app-check';
import { solveChallenge } from 'altcha-lib';
import type { Challenge, Solution } from 'altcha-lib/types';

export interface IAltchaProviderOptionsConfig {
  appId: string;
  createAltchaChallengeUrl: string;
  createAppCheckTokenUrl: string;
}

export class AltchaProviderOptions implements CustomProviderOptions {
  constructor(readonly config: IAltchaProviderOptionsConfig) {}

  async getToken(): Promise<AppCheckToken> {
    const challenge = await this.createAltchaChallenge();
    const solution = await solveChallenge(challenge.challenge, challenge.salt)
      .promise;
    if (!solution) {
      throw new Error('Unable to find ALTCHA solution.');
    }
    return this.createAppCheckToken(challenge, solution);
  }

  async createAltchaChallenge(): Promise<Challenge> {
    const resp = await fetch(this.config.createAltchaChallengeUrl);
    if (resp.status !== 200) {
      throw new Error(`Server responded with ${resp.status}.`);
    }
    const json = await resp.json();
    if (!json.challenge) {
      throw new Error(`Invalid server response. ALTCHA challenge expected.`);
    }
    return json;
  }

  async createAppCheckToken(
    challenge: Challenge,
    solution: Solution
  ): Promise<AppCheckToken> {
    const resp = await fetch(this.config.createAppCheckTokenUrl, {
      body: JSON.stringify({
        appId: this.config.appId,
        payload: {
          ...challenge,
          number: solution.number,
        },
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    });
    if (resp.status !== 200) {
      throw new Error(`Server responded with ${resp.status}.`);
    }
    return resp.json();
  }
}
