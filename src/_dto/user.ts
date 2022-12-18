export interface UserSignupDTO {
    name: string;
    email: string;
    password: string;
}

export interface UserLoginDTO {
    email: string;
    password: string;
}

export interface UserProfileDTO {
    id: number;
    name: string;
    email: string;
}
