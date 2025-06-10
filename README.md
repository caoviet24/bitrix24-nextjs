# Hệ thống Quản lý Liên hệ Bitrix24

Ứng dụng web quản lý liên hệ tích hợp với Bitrix24, được xây dựng bằng Next.js, TypeScript và Tailwind CSS.

## 🚀 Tính năng chính

- **Tích hợp Bitrix24**: Kết nối trực tiếp với hệ thống CRM Bitrix24
- **Quản lý liên hệ**: Thêm, sửa, xóa và xem danh sách liên hệ
- **Tìm kiếm và lọc**: Tìm kiếm theo tên, lọc theo tỉnh thành, số điện thoại, email, ngân hàng
- **Xác thực OAuth**: Đăng nhập an toàn qua Bitrix24 OAuth
- **Phân trang**: Hiển thị danh sách liên hệ với phân trang
- **Giao diện responsive**: Tương thích với mọi thiết bị
- **Quản lý địa chỉ Việt Nam**: Combobox tỉnh/thành, quận/huyện, phường/xã

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (khuyến nghị)
- Tài khoản Bitrix24 với quyền tạo ứng dụng

## ⚙️ Cài đặt và cấu hình

### 1. Clone dự án

```bash
git clone <repository-url>
cd my-app
```

### 2. Cài đặt dependencies

```bash
# Sử dụng pnpm (khuyến nghị)
pnpm install

# Hoặc sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

### 3. Cấu hình Bitrix24

#### Tạo ứng dụng trên Bitrix24

1. Đăng nhập vào tài khoản Bitrix24 của bạn
2. Vào **Ứng dụng** > **Developer resources** > **Other** > **Local application**
3. Điền thông tin ứng dụng:
   - **Application name**: Tên ứng dụng của bạn
   - **Application code**: Mã ứng dụng (ví dụ: contact-manager)
   4. Trong **Application settings**:
   - **Handler path**: `https://your-domain.com/callback`
   - **Initial installation path**: `https://your-domain.com/`
5. Cấp quyền cần thiết:
   - `crm` - Quản lý CRM
   - `user` - Thông tin người dùng
6. Lưu lại **Client ID** và **Client Secret**

#### Tạo file .env.local


```bash
# Cấu hình .env
NEXT_PUBLIC_BITRIX_DOMAIN=https://your-account.bitrix24.vn
NEXT_PUBLIC_BITRIX_CLIENT_ID=your_client_id
NEXT_PUBLIC_BITRIX_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_BITRIX_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

**Lưu ý**: Thay thế các giá trị sau:
- `your-account`: Tên tài khoản Bitrix24 của bạn
- `your_client_id`: Client ID từ ứng dụng Bitrix24
- `your_client_secret`: Client Secret từ ứng dụng Bitrix24

### 4. Chạy ứng dụng

#### Development mode

```bash
# Sử dụng pnpm
pnpm dev

# Hoặc sử dụng npm
npm run dev

# Hoặc sử dụng yarn
yarn dev
```

Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

#### Production mode

```bash
# Build ứng dụng
pnpm build

# Chạy production server
pnpm start
```

## 🔐 Quy trình xác thực

1. Truy cập ứng dụng lần đầu
2. Nhấn nút **"Kết nối Bitrix24"**
3. Đăng nhập vào tài khoản Bitrix24
4. Cấp quyền cho ứng dụng
5. Tự động chuyển hướng về ứng dụng với token

## 📱 Hướng dẫn sử dụng

### Quản lý liên hệ

- **Xem danh sách**: Danh sách liên hệ hiển thị với thông tin cơ bản
- **Tìm kiếm**: Nhập tên liên hệ vào ô tìm kiếm
- **Lọc nâng cao**: Sử dụng bộ lọc theo tỉnh thành, điện thoại, email, ngân hàng
- **Thêm liên hệ**: Nhấn nút "Thêm Liên hệ" và điền form
- **Chỉnh sửa**: Nhấn icon bút chì trong hàng liên hệ
- **Xóa**: Nhấn icon thùng rác để xóa liên hệ

### Điều hướng

- **Phân trang**: Sử dụng nút Previous/Next hoặc nhấn số trang
- **Chi tiết liên hệ**: Nhấn icon người dùng để xem chi tiết

## 🗂️ Cấu trúc dự án

```
my-app/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   └── contacts/      # Contact CRUD endpoints
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # Business logic services
│   │   ├── callback/          # OAuth callback page
│   │   └── page.tsx           # Main dashboard page
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── ContactForm.tsx   # Contact form modal
│   │   ├── ContactFilters.tsx # Filter component
│   │   └── *Combobox.tsx     # Location selection components
│   ├── configs/              # Configuration files
│   ├── lib/                  # Utility libraries
│   ├── providers/            # React context providers
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── public/                   # Static assets
└── ...config files
```

## 🔧 Scripts có sẵn

```bash
# Phát triển với Turbopack (nhanh hơn)
pnpm dev

# Build cho production
pnpm build

# Chạy production server
pnpm start

# Kiểm tra code với ESLint
pnpm lint
```

## 🐛 Xử lý sự cố

### Lỗi thường gặp

**1. "Yêu cầu cấu hình Bitrix24"**
- Kiểm tra file `.env.local` có đúng thông tin không
- Đảm bảo `NEXT_PUBLIC_BITRIX_CLIENT_ID` và `NEXT_PUBLIC_BITRIX_CLIENT_SECRET` đã được cấu hình

**2. "Kết nối với Bitrix24" không hoạt động**
- Kiểm tra `NEXT_PUBLIC_BITRIX_REDIRECT_URI` khớp với cấu hình trên Bitrix24
- Đảm bảo domain Bitrix24 chính xác

**3. Lỗi CORS**
- Cập nhật `allowedOrigins` trong `next.config.ts` nếu sử dụng ngrok hoặc domain khác

**4. Token hết hạn**
- Ứng dụng tự động refresh token
- Nếu vẫn lỗi, xóa token trong `.env.local` và xác thực lại

### Debug mode

Để bật debug mode cho React Query:

```bash
# Development với devtools
pnpm dev
```

Mở **React Query Devtools** ở góc dưới màn hình để theo dõi API calls.
## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
