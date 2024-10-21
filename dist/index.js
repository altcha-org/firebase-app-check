import { solveChallenge } from 'altcha-lib';
export class AltchaProviderOptions {
    config;
    constructor(config) {
        this.config = config;
    }
    async getToken() {
        const challenge = await this.createAltchaChallenge();
        const solution = await solveChallenge(challenge.challenge, challenge.salt)
            .promise;
        if (!solution) {
            throw new Error('Unable to find ALTCHA solution.');
        }
        return this.createAppCheckToken(challenge, solution);
    }
    async createAltchaChallenge() {
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
    async createAppCheckToken(challenge, solution) {
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
