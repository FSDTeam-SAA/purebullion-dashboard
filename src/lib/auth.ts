import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "purebullion-secret-key",
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080/api/v1";

        try {
          const res = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (res.ok) {
            const response = await res.json();
            const user = response.data?.user || response.data || response.user;
            const accessToken =
              response.data?.accessToken ||
              response.data?.token ||
              response.accessToken ||
              response.token ||
              null;

            const name =
              user?.fullName ||
              [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
              user?.name ||
              credentials.email.split("@")[0];

            const role = String(user?.role ?? "").trim().toLowerCase();
            const isAuthorized =
              role === "admin" ||
              role === "superadmin" ||
              role === "super_admin";

            if (!isAuthorized) {
              throw new Error("Access denied. Only administrators can log in to this portal.");
            }

            let permissions: string[] = Array.isArray(user?.permissions)
              ? user.permissions
              : [];

            // Extract from JWT accessToken if permissions is empty in user object
            if (permissions.length === 0 && accessToken && typeof accessToken === 'string') {
              try {
                const parts = accessToken.split('.');
                if (parts.length === 3) {
                  const decoded = JSON.parse(
                    Buffer.from(parts[1], 'base64').toString('utf-8')
                  );
                  if (Array.isArray(decoded.permissions) && decoded.permissions.length > 0) {
                    permissions = decoded.permissions;
                  }
                }
              } catch {
                // ignore
              }
            }

            // Super Admin has full permissions
            if ((role === 'superadmin' || role === 'super_admin') && permissions.length === 0) {
              permissions = ['ALL'];
            }

            if (!accessToken || typeof accessToken !== "string") {
              throw new Error("Login failed: the server did not return an access token.");
            }

            return {
              id: user?._id || user?.id,
              name,
              email: user?.email || credentials.email,
              phoneNumber: user?.phoneNumber || null,
              role: user.role,
              profileImage: user?.photo || user?.profileImage || null,
              accessToken,
              permissions,
            };
          } else {
            const errorData = await res.json().catch(() => null);
            const message = errorData?.message || "Invalid email or password";
            throw new Error(Array.isArray(message) ? message.join(", ") : message);
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.message && error.message !== "fetch failed") {
            throw error;
          }
          throw new Error("Cannot connect to the server. Please try again later.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
        token.permissions = user.permissions || [];
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        phoneNumber: token.phoneNumber,
        role: token.role,
        profileImage: token.profileImage,
        accessToken: token.accessToken,
        permissions: token.permissions || [],
      };
      return session;
    },
  },
};
