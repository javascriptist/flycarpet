# 🚨 Backend Not Running - Quick Fix

## Problem
Your Next.js storefront cannot start because the Medusa backend at `http://localhost:9000` is not running.

## Solution

### **Step 1: Open a New Terminal**
Keep the current terminal open, and open a **second terminal window**.

### **Step 2: Navigate to Backend Directory**
```bash
# If your backend is in a separate folder:
cd /path/to/your/medusa-backend

# Common locations:
# cd ../medusa-backend
# cd ~/urgaz-backend
# cd ~/Desktop/urgaz-backend
```

### **Step 3: Start the Backend**
```bash
# Start Medusa backend
npm run dev

# Or if using yarn:
yarn dev

# Or with medusa CLI:
medusa develop
```

### **Step 4: Wait for Backend to Start**
You should see output like:
```
✓ Server is ready on port 9000
✓ Database connected
✓ Store API available at /store
✓ Admin API available at /admin
```

### **Step 5: Test Backend is Running**
In a third terminal:
```bash
curl http://localhost:9000/health
# Should return: {"status":"ok"}
```

### **Step 6: Restart Frontend**
Go back to your storefront terminal and restart:
```bash
# Press Ctrl+C to stop
# Then run:
npm run dev
```

---

## Alternative: Quick Backend Health Check

If you're not sure where your backend is:

```bash
# Check if backend is running
lsof -i :9000

# If nothing returns, backend is NOT running
```

---

## Typical Project Structure

```
project-root/
├── urgaz-storefront/    ← Your current directory (frontend)
│   ├── src/
│   ├── package.json
│   └── .env
└── urgaz-backend/       ← Your Medusa backend (needs to be running)
    ├── src/
    ├── package.json
    └── .env
```

---

## 🔄 Development Workflow

**You need TWO terminals running simultaneously:**

**Terminal 1 - Backend:**
```bash
cd /path/to/urgaz-backend
npm run dev
# Runs on http://localhost:9000
```

**Terminal 2 - Frontend:**
```bash
cd /path/to/urgaz-storefront
npm run dev
# Runs on http://localhost:8000
```

---

## 🆘 If You Don't Have a Backend

If you haven't set up the Medusa backend yet:

1. **Clone/Create Medusa Backend:**
```bash
cd ~/Desktop
npx create-medusa-app@latest
# Or clone your existing backend repo
```

2. **Configure Backend:**
   - Set up database (PostgreSQL)
   - Run migrations
   - Seed data
   - Configure regions

3. **Start Backend:**
```bash
cd medusa-backend
npm run dev
```

4. **Then Start Frontend**

---

## ✅ Verification Checklist

- [ ] Backend terminal shows "Server is ready on port 9000"
- [ ] `curl http://localhost:9000/health` returns `{"status":"ok"}`
- [ ] Frontend can now load without middleware errors
- [ ] Can visit http://localhost:8000/uz

---

## 📞 Need Help?

If backend still won't start:
1. Check database is running (PostgreSQL)
2. Verify backend `.env` configuration
3. Run `npm install` in backend directory
4. Check backend logs for errors

**Both backend AND frontend must run simultaneously!** 🚀