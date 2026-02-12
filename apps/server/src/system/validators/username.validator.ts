
export class UsernameValidator {
    private static readonly USERNAME_REGEX = /^[a-z_][a-z0-9_-]*$/;

    static validate(username: string): boolean {
        if (!username) return false;
        return this.USERNAME_REGEX.test(username);
    }

    static assertValid(username: string): void {
        if (!this.validate(username)) {
            throw new Error(`Invalid username format. Must strictly match regex: ${this.USERNAME_REGEX}`);
        }
    }
}
