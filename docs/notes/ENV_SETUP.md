# 🔐 Environment Variables Setup

## ⚠️ IMPORTANT: Never Commit `.env` Files!

The `.env` file contains sensitive information like API keys and should **never** be committed to GitHub.

## 📋 Setup Instructions

### 1. Copy the Example File

```bash
cp .env.example .env
```

### 2. Fill in Your Values

Edit `.env` and replace the placeholder values:

```bash
# Backend URL (use ngrok for local development with HTTPS)
MEDUSA_BACKEND_URL=https://your-ngrok-url.ngrok-free.app/
NEXT_PUBLIC_API_BASE_URL=https://your-ngrok-url.ngrok-free.app/

# Payme Merchant ID
NEXT_PUBLIC_PAYME_MERCHANT_ID=your_actual_merchant_id

# Medusa Publishable Key
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_actual_key

# Stripe Public Key (if using Stripe)
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_key
```

### 3. Where to Get Values

#### Payme Merchant ID:
- **Test:** https://test.paycom.uz/
- **Production:** https://business.paycom.uz/
- Look for "Merchant ID" or "ID мерчанта"

#### Medusa Publishable Key:
```bash
# In your Medusa backend:
cd backend
npm run dev

# Then create a publishable key via API or admin panel
```

#### Stripe Key:
- **Dashboard:** https://dashboard.stripe.com/test/apikeys
- Copy the "Publishable key" (starts with `pk_test_`)

### 4. Local vs Production

**For Local Development:**
```bash
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

**For Production with ngrok:**
```bash
# Start ngrok
ngrok http 9000

# Copy the HTTPS URL to .env
MEDUSA_BACKEND_URL=https://abc123.ngrok-free.app/
```

**For Deployed Production:**
```bash
MEDUSA_BACKEND_URL=https://api.yoursite.com
NEXT_PUBLIC_BASE_URL=https://yoursite.com
```

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore`
- Use `.env.example` as a template
- Use environment variables for all secrets
- Use different keys for test/production
- Rotate keys regularly

### ❌ DON'T:
- Commit `.env` to git
- Share API keys in public repos
- Use production keys in development
- Hardcode secrets in code
- Share `.env` files via email/chat

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MEDUSA_BACKEND_URL` | ✅ | Your Medusa backend URL |
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | API base URL (usually same as backend) |
| `NEXT_PUBLIC_PAYME_MERCHANT_ID` | ✅ | Payme merchant ID for payments |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | ✅ | Medusa publishable API key |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Your storefront URL |
| `NEXT_PUBLIC_DEFAULT_REGION` | ✅ | Default region (e.g., "uz") |
| `NEXT_PUBLIC_STRIPE_KEY` | ⚠️ | Stripe public key (if using Stripe) |
| `REVALIDATE_SECRET` | ⚠️ | Next.js revalidation secret |

## 🚀 Quick Start

```bash
# 1. Copy example file
cp .env.example .env

# 2. Edit with your values
nano .env  # or use your favorite editor

# 3. Start development server
npm run dev

# 4. Visit http://localhost:8000
```

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Check `MEDUSA_BACKEND_URL` is correct
- Ensure backend is running
- For HTTPS/ngrok: Update CORS in backend

### "Payme not showing"
- Verify `NEXT_PUBLIC_PAYME_MERCHANT_ID` is set
- Check merchant ID format (no spaces/quotes)
- Restart dev server after changing .env

### "Payment fails"
- Check backend has matching merchant credentials
- Verify webhook URL is configured in Payme
- Test with Payme test cards

## 📚 Additional Resources

- [Medusa Environment Variables](https://docs.medusajs.com/usage/configurations)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Payme Documentation](https://developer.help.paycom.uz/)

---

**Need help?** Check the documentation files in the project root (PAYME_*.md files).
