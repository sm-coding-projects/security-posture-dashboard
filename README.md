# Security Posture Dashboard

A comprehensive Next.js application for monitoring and managing your organization's security posture through automated security scans, compliance tracking, and risk assessment.

## Features

### 🔐 Authentication & Authorization
- Secure user authentication with NextAuth.js
- Role-based access control (Admin, User, Viewer)
- Protected routes and middleware
- Session management

### 🔍 Security Scanning
- **SSL/TLS Analysis**: Certificate validation, protocol support, cipher strength
- **DNS Security**: DNS record validation, subdomain enumeration, security headers
- **HTTP Headers**: Security header analysis, HSTS, CSP, and more
- **Domain Validation**: Input sanitization and domain verification

### 📊 Dashboard & Analytics
- Real-time security score visualization with gauge charts
- Comprehensive scan history and trends
- Detailed security findings with actionable recommendations
- Export capabilities for compliance reporting

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Professional dashboard layout with sidebar navigation
- Interactive charts and data visualization
- Loading states, error handling, and empty states
- Custom UI components built with shadcn/ui

### 🗄️ Database & API
- Prisma ORM with PostgreSQL support
- RESTful API endpoints for all operations
- Database seeding and migration scripts
- Comprehensive error handling

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM, PostgreSQL
- **API**: Next.js API routes
- **Charts**: Custom gauge and progress components
- **Deployment**: Vercel-ready configuration

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sm-coding-projects/security-posture-dashboard.git
cd security-posture-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/security_dashboard"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `GET/POST /api/auth/*` - NextAuth.js authentication routes

### Security Scans
- `GET /api/scans` - List all scans
- `POST /api/scan` - Create new scan
- `GET /api/scan/[id]` - Get scan details
- `PUT/DELETE /api/scan/[id]` - Update/delete scan

### User Management
- `GET /api/user` - Get current user profile

### Health Check
- `GET /api/health` - Application health status

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Dashboard pages
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   ├── layout/                   # Layout components
│   ├── scan/                     # Scan result components
│   └── ui/                       # Reusable UI components
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication helpers
│   ├── db/                       # Database utilities
│   ├── scanners/                 # Security scanner implementations
│   ├── utils/                    # General utilities
│   └── validators/               # Input validation
├── prisma/                       # Database schema and migrations
├── types/                        # TypeScript type definitions
└── docs/                         # Documentation
```

## Database Schema

The application uses the following main entities:

- **User**: User accounts with roles and authentication
- **Scan**: Security scan records with results and metadata
- **ScanResult**: Detailed scan findings and recommendations

## Security Features

### Input Validation
- Domain name validation and sanitization
- XSS protection
- SQL injection prevention
- Rate limiting

### Authentication Security
- Secure session management
- CSRF protection
- Password hashing (when using credentials)
- OAuth integration support

### Data Protection
- Environment variable security
- Database connection encryption
- Secure HTTP headers
- Content Security Policy

## Testing

Run the test suite:

```bash
npm run test
# or
yarn test
```

Run API tests:
```bash
npm run test:api
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the [API documentation](docs/API.md)
- Review the troubleshooting guide in the docs

## Roadmap

- [ ] Advanced vulnerability scanning
- [ ] Integration with external security tools
- [ ] Automated compliance reporting
- [ ] Multi-tenant support
- [ ] Real-time notifications
- [ ] API rate limiting dashboard
