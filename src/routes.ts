export const publicRoutes = ["/", "/library", "/about", "/contact",];

export const authRoutes = ["/login", "/signup"];

//We make sure the authentication API route is always public.
export const apiRoute = "/api/auth";

// redirect users to this path after login
export const DEFAULT_LOGIN_REDIRECT = "/students";
