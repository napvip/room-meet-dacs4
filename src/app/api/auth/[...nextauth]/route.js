import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    // Cấu hình các nhà cung cấp dịch vụ xác thực
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
        
    ],
    callbacks: {
        // hàm callback được gọi khi người dùng đăng nhập thành công
        async signIn({ user, profile }) {
            await dbConnect();
            let dbUser = await User.findOne({ email: user.email });

            // nếu người dùng không tồn tại trong cơ sở dữ liệu, tạo tài khoản mới
            if (!dbUser) {
                dbUser = await User.create({
                    name: profile.name,
                    email: profile.email,
                    profilePicture: profile.picture,
                    isVerified: profile.email_verified ? true : false
                });
            }

            // gán ID của người dùng từ cơ sở dữ liệu vào đối tượng user
            user.id = dbUser._id.toString();
            return true;
        }
    },
    session: {
        strategy: 'jwt', // sử dụng JWT để quản lý session
        maxAge: 90 * 24 * 60 * 60 // thời gian tồn tại của session là 90 ngày
    },
    pages: {
        signIn: '/user-auth', // Đường dẫn đến trang đăng nhập
    }
};

const handle = NextAuth(authOptions);
export { handle as POST, handle as GET };