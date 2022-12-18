import { UserProfileDTO } from './user';

export class UserProfile {
    public id: number;
    public name: string;
    public email: string;

    private constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public static create(
        id: number,
        name: string,
        email: string,
    ): UserProfileDTO {
        return {
            id,
            name,
            email,
        };
    }
}
