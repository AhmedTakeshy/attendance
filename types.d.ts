type ServerResponse<T> =
    { successMessage: string, data: T; status: "Success"; statusCode: number } |
    { errorMessage: string; status: "Error"; statusCode: number };

type Metadata<T extends object> = {
    [K in keyof T]: T[K];
} & {
    metadata: {
        hasNextPage: boolean;
        totalPages: number;
    };
};

type CredentialsProvider = {
    type: "credentials";
    email: string;
    password: string;
};

type OAuthProvider = {
    type: "google" | "facebook" | "instagram" | "twitter";
};
type Provider = CredentialsProvider | OAuthProvider;