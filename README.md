# CRM API Application

Ứng dụng CRM API được xây dựng trên nền tảng Next.js, sử dụng TypeScript, và tích hợp với API Bitrix24.

## Cấu trúc thư mục

```
/my-app
├── public/                   # Tài nguyên tĩnh
├── src/                      # Mã nguồn
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Authentication API
│   │   │   ├── contacts/     # Contacts API
│   │   │   ├── requisites/   # Requisites API
│   │   │   └── swagger/      # Swagger API
│   │   ├── api-docs/         # Trang tài liệu API
│   │   ├── requisites/       # Trang Requisites
│   │   └── services/         # Services cho client
│   ├── components/           # React Components
│   │   ├── ui/               # UI Components
│   │   └── SwaggerUIWrapper.tsx # Wrapper cho Swagger UI
│   ├── configs/              # Cấu hình
│   │   ├── bitrixConfig.ts   # Cấu hình Bitrix
│   │   └── swagger.ts        # Cấu hình Swagger
│   ├── lib/                  # Thư viện tiện ích
│   ├── providers/            # Providers cho React
│   ├── types/                # Type definitions
│   └── utils/                # Hàm tiện ích
├── .env                      # Biến môi trường
├── .gitignore                # Git ignore
├── components.json           # Cấu hình components
├── docker-compose.yml        # Cấu hình Docker Compose
├── Dockerfile                # Cấu hình Docker
├── next.config.ts            # Cấu hình Next.js
├── package.json              # Dependencies
├── pnpm-lock.yaml            # PNPM lockfile
├── tsconfig.json             # Cấu hình TypeScript
└── README.md                 # Tài liệu
```

## Cấu hình môi trường

### Yêu cầu hệ thống

- Node.js v20+
- PNPM v10+

### Biến môi trường

Tạo file `.env` ở thư mục gốc với các biến sau:

```env
# Bitrix24 API
BITRIX_DOMAIN=https://your-domain.bitrix24.com
BITRIX_CLIENT_ID=your-client-id
BITRIX_CLIENT_SECRET=your-client-secret
BITRIX_REDIRECT_URI=http://localhost:3000/callback

# Port cho Next.js
PORT=3000
```

## API Documentation (Swagger)

Ứng dụng sử dụng Swagger UI để cung cấp tài liệu API. Cấu hình Swagger được thiết lập trong các file:

- `src/configs/swagger.ts`: Cấu hình chính cho Swagger
- `src/app/api/swagger/route.ts`: API route để phục vụ tài liệu Swagger
- `src/app/api-docs/page.tsx`: Trang web hiển thị Swagger UI
- `src/components/SwaggerUIWrapper.tsx`: Component wrapper cho Swagger UI

Swagger được cấu hình để giải quyết vấn đề khi sử dụng `next-swagger-doc` với Next.js:
1. Tạo API endpoint (`/api/swagger`) để tạo và phục vụ tài liệu Swagger từ server
2. Trang API docs sẽ tải tài liệu từ endpoint thay vì tạo trực tiếp
3. Sử dụng package `server-only` để đảm bảo code chỉ chạy trên server
4. Cấu hình webpack để xử lý các module chỉ dành cho server

## Các API chính

### 1. Contact API

- `GET /api/contacts`: Lấy danh sách contacts với bộ lọc tùy chọn
- `POST /api/contacts`: Tạo contact mới
- `PUT /api/contacts/[id]`: Cập nhật contact
- `DELETE /api/contacts/[id]`: Xóa contact

### 2. Requisites API

- `GET /api/requisites`: Lấy danh sách requisites
- `POST /api/requisites`: Tạo requisite mới

### 3. Bank Detail API

- `GET /api/requisites/bank-detail`: Lấy danh sách bank details
- `POST /api/requisites/bank-detail`: Tạo bank detail mới
- `GET /api/requisites/bank-detail/[id]`: Lấy bank detail theo ID
- `PUT /api/requisites/bank-detail/[id]`: Cập nhật bank detail
- `DELETE /api/requisites/bank-detail/[id]`: Xóa bank detail

## Cách chạy ứng dụng

### Cài đặt dependencies

```bash
# Cài đặt dependencies
pnpm install
```

### Chạy môi trường development

```bash
# Chạy development server
pnpm dev
```

Truy cập ứng dụng tại http://localhost:3000

Truy cập tài liệu API tại http://localhost:3000/api-docs

### Build và chạy cho môi trường production

```bash
# Build ứng dụng
pnpm build

# Chạy ứng dụng production
pnpm start
```

### Chạy với Docker

```bash
# Build Docker image
docker build -t my-crm-app .

# Chạy với Docker Compose
docker-compose up -d
```

## Các tính năng chính

- Quản lý contacts
- Quản lý requisites và bank details
- API Documentation với Swagger
- Tích hợp với Bitrix24 API
- Giao diện người dùng thân thiện
