# Fixing "Submission Failed - Row-Level Security Policy" Error

## Problem
When submitting a found item report from the home page, you get this error:
```
Submission Failed
new row violates row-level security policy
```

## Root Cause
The Supabase database has Row-Level Security (RLS) policies that are blocking anonymous (non-logged-in) users from inserting found item reports.

## Solution
You need to update the RLS policies in your Supabase database to allow anonymous submissions for found items.

---

## Step-by-Step Fix

### Option 1: Using Supabase Dashboard (RECOMMENDED)

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Fix Script**
   - Open this file: `c:\xampp\htdocs\BALIK\balik-system\balik-app\supabase\fix_anonymous_submission.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Go to your home page and try submitting a found item report again

---

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
cd c:\xampp\htdocs\BALIK\balik-system\balik-app
supabase db execute --file supabase/fix_anonymous_submission.sql
```

---

## What the Fix Does

The SQL script performs these actions:

1. **Allows NULL user_id**: Removes the NOT NULL constraint on the `user_id` column so anonymous submissions can have `user_id = NULL`

2. **Creates Policy for Authenticated Users**: Allows logged-in users to submit both lost and found items

3. **Creates Policy for Anonymous Users**: Allows non-logged-in users to submit ONLY found items (not lost items, which require an account)

4. **Enables RLS**: Ensures Row-Level Security is enabled on the items table

---

## Testing After Fix

1. **Go to your home page**: Navigate to `http://localhost:5173` (or your dev server URL)

2. **Scroll to "Report Found Item" section**

3. **Fill out the form**:
   - What was Found: "Test Wallet"
   - Category: "Wallets & Bags"
   - Date Found: Today's date
   - Location: "Library"
   - Check "Submit Anonymously"

4. **Submit the form**

5. **Expected Result**: You should see a success message instead of the error

---

## Troubleshooting

### If you still get the error after running the SQL:

1. **Check if the SQL ran successfully**:
   - Go to Supabase Dashboard → SQL Editor
   - Run this query to check policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'items';
   ```
   - You should see two policies:
     - "Authenticated users can insert items"
     - "Anonymous users can report found items"

2. **Check the items table structure**:
   ```sql
   SELECT column_name, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'items' AND column_name = 'user_id';
   ```
   - `is_nullable` should be `YES`

3. **Clear browser cache and reload**:
   - Press Ctrl+Shift+R to hard reload

4. **Check browser console for errors**:
   - Press F12 to open DevTools
   - Check the Console tab for any errors

### If the form data is not being sent correctly:

Check the Home.jsx code around line 275-278:
```javascript
// 2.5 Only attach user_id if logged in
if (user?.id) {
  mappedData.user_id = user.id;
}
```

This ensures that anonymous submissions DON'T include a user_id.

---

## Important Notes

- **Lost items still require login**: Only found items can be submitted anonymously
- **Anonymous submissions**: Will have `user_id = NULL` in the database
- **Reporter info**: Anonymous submissions store reporter info in the `metadata` field instead of linking to a user

---

## Files Modified

1. `supabase/fix_anonymous_submission.sql` - New SQL script to fix RLS policies
2. `src/pages/Home.jsx` - Already configured correctly (lines 275-278)
3. `NLP_SMART_MATCHING_FIX.md` - Previous fix for smart matching (run this SQL too if you haven't)

---

## Related Issues

If you encounter issues with smart matching not showing matches, also run:
- `supabase/multi_factor_matching.sql` (updated in the NLP fix)

Both SQL scripts need to be executed in your Supabase database for the system to work properly.
