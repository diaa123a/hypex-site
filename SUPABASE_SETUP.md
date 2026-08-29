# دليل إعداد Supabase وتشغيل المشروع

هذا الملف يشرح خطوات إعداد مشروع Supabase، تشغيل `schema.sql`، إضافة مشرف (admin)، تعبئة `config.js` ونشر الموقع إلى Netlify/Vercel.

مراحل سريعة

1) إنشاء مشروع Supabase
   - سجّل دخولك إلى https://app.supabase.com وابدأ مشروعًا جديدًا (Free tier كافٍ للمجربات).

2) تشغيل `schema.sql` (ينشئ جدول `site_content` ويملأ المحتوى الافتراضي)
   - افتح المشروع → SQL Editor → New query
   - انسخ محتوى الملف `schema.sql` في المستودع (موجود في الجذر) ألصقه ثم اضغط Run
   - ستتم عملية إنشاء الجدول وإدخال السجل الافتراضي.

3) إنشاء مستخدم أدمن في المصادقة
   - افتح Supabase → Authentication → Users → New user
   - ضع البريد: `diaaasmar699@gmail.com` (أدخل كلمة المرور التي تختارها بنفسك — لا تشاركها هنا)
   - بعد الإنشاء: افتح المستخدم وانسخ الـUID (حقل `UID`) — ستحتاجه لإدراج المشرف في قاعدة البيانات.

4) إضافة جدول المشرفين (admins) وتقييد RLS (سياسة أكثر أماناً)
   - افتح SQL Editor → New query ثم نفّذ (أو انسخ والصق):

```sql
-- جدول admins لتخزين uids المشرفين
create table if not exists public.admins (
  id bigint primary key generated always as identity,
  uid uuid not null,
  email text,
  created_at timestamptz default now()
);

-- سياسة: فقط المشرفين المدرجين في public.admins يمكنهم تعديل المحتوى
create policy "admins can modify site_content"
  on public.site_content
  for all
  using (
    auth.role() = 'authenticated' AND
    exists (select 1 from public.admins a where a.uid = auth.uid())
  )
  with check (
    auth.role() = 'authenticated' AND
    exists (select 1 from public.admins a where a.uid = auth.uid())
  );
```

   - بعد تنفيذ الإنشاء/السياسة، أدخل السطر التالي مع استبدال `<ADMIN_UID>` بالـUID الذي نسخته:

```sql
insert into public.admins (uid, email) values ('<ADMIN_UID>', 'diaaasmar699@gmail.com');
```

5) تعبئة `config.js` في المستودع
   - اذهب إلى Supabase → Project → Settings → API
   - انسخ "Project URL" إلى `SUPABASE_URL` (مثال: `https://xyzabcdef.supabase.co`)
   - انسخ "anon/public" key إلى `SUPABASE_ANON_KEY`
   - افتح الملف `config.js` في المستودع أو استخدم واجهة GitHub لتحريره، وضع القيم كالتالي:

```js
window.HYPEX_CONFIG = {
  SUPABASE_URL: "https://your-project-ref.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR..."
};
```

   - حفظ/الالتزام (commit) ثم ادفع التغيير إلى GitHub إن كانت التغييرات محليّة.

6) تجربة لوحة التحكم
   - بعد تشغيل `schema.sql` وتعبئة `config.js`:
     - افتح `https://<your-hosted-site>/admin.html` بعد النشر، أو افتح الملف `admin.html` محليًا
     - سجّل دخول المشرف عبر البريد الذي أنشأته، ثم عدّل المحتوى واضغط Save.

7) نشر الموقع (Netlify أو Vercel)
   - Netlify (سهل للمواقع الثابتة):
     1. اذهب إلى https://app.netlify.com → Sites → New site → Import from Git
     2. اربط حساب GitHub واختر المستودع `diaa123a/hypex-site`
     3. اختر الفرع `main`، لا حاجة لأمر بناء لأن الموقع ثابت → Publish directory: `/`
     4. اضغط Deploy site.
   - Vercel:
     1. https://vercel.com → New Project → Import Git Repository
     2. اختر repo → إطار العمل: Other → Output Directory: `/` → Deploy.

8) ملاحظات أمنيّة هامة
   - لا تشارك كلمات المرور أو مفاتيح `service_role` عبر الدردشة أو مستودع عام.
   - مفتاح `anon` مخصّص للواجهة الأمامية ويُستخدم عادة في config.js؛ تأكد أن سياسات RLS تمنع التعديلات إلا للمشرفين.
   - فعّل المصادقة متعددة العوامل (MFA) على حساب GitHub وSupabase إن أمكن.
   - إن كنت قد شاركت كلمة مرور في الدردشة سابقًا، غيّرها فورًا.

إذا رغبت أتابع نيابةً عنك:
- أملأ `config.js` (أرسل فقط SUPABASE_URL و SUPABASE_ANON_KEY). أو
- أرشدك خطوة‑ب‑خطوة أثناء تنفيذ أي خطوة على لوحة Supabase (اطلب "أرشدني الآن" وسأرشدك تفاعليًا).