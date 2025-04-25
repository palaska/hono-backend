# Email Service

A flexible, template-based email sending service built with Nodemailer and Handlebars.

## Features

- SMTP configuration via environment variables
- Handlebars template support with multiple languages
- Type-safe email templates with Zod schema validation
- Lazy initialization

## Usage

### Configuration

Configure the email service through environment variables:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
EMAIL_FROM=noreply@example.com
```

### Initialization

Initialize the email service at application startup:

```typescript
import { initEmailService } from "@/lib/email";

// Initialize with environment configuration
initEmailService(env);
```

### Sending Emails

Send emails using the predefined templates:

```typescript
import { sendEmail } from "@/lib/email";

// Send welcome email
await sendEmail.welcome({
  to: "user@example.com",
  lang: "en",
  data: {
    name: "John Doe",
    verificationUrl: "https://example.com/verify?token=abc123",
  },
});
```

## Email Templates

Templates are located in `src/lib/email/templates/` and follow this structure:

```
templates/
  └── welcome/
      ├── en.hbs  # English template
      └── schema.ts  # Zod schema for data validation
```

### Creating New Templates

1. Create a new directory in `templates/`
2. Add language-specific Handlebars templates (e.g., `en.hbs`)
3. Define a Zod schema in `schema.ts`
4. Register the template in `index.ts`

### Template Format

Templates use Handlebars syntax and should include a subject line separated by `===SUBJECT END===`:

```handlebars
Welcome to Our Service
===SUBJECT END===
<h1>Hello {{name}}!</h1>
<p>Thank you for signing up.</p>
```
