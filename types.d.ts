type ServerResponse<T> =
    { successMessage: string, data: T; status: "Success"; statusCode: number } |
    { errorMessage: string; status: "Error"; statusCode: number };

type CredentialsProvider = {
    type: "credentials";
    email: string;
    password: string;
};

type OAuthProvider = {
    type: "google" | "facebook" | "instagram";
};
type Provider = CredentialsProvider | OAuthProvider;