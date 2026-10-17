# Live content manager setup

The content manager publishes projects, experience, and testimonials to Netlify Blobs through the `/api/content` function. Published items are available to every visitor without a new site deploy.

## Before deploying

1. In Netlify, open this site and go to **Project configuration → Environment variables**.
2. Add `CMS_ADMIN_PASSWORD` with a strong, unique password. Keep it private and do not put it in `.env`, source code, or GitHub.
3. Push the code changes to the GitHub branch connected to this Netlify site. Netlify will install `@netlify/blobs`, build the site, and deploy the function.
4. After the deploy succeeds, open `https://<your-site>.netlify.app/admin` and sign in with the password from step 2.

The password is checked by the Netlify Function and is never included in the public site bundle. Public visitors can read content; only requests with the password can write it. Netlify Blobs stores content independently of deploys, so publishing from the admin page does not require a new GitHub commit or deploy.

For local development, the Vite dev server does not run Netlify Functions. Use Netlify Dev to run the site together with its function and Blobs services.
