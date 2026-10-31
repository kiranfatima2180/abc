# LLM Chatbot — Next.js + OpenAI + Vercel

A starter LLM-powered chatbot with a responsive chat interface, conversation context, and a server-side API route. It is designed to be uploaded to GitHub and deployed on Vercel.

## Features

- LLM responses through the OpenAI API
- Sends recent conversation messages for context
- Responsive desktop and mobile interface
- Loading state, clear-chat button, and basic error handling
- API key stays on the server (never put it in a `NEXT_PUBLIC_` variable)
- System instructions can be customized in `app/api/chat/route.js`

## 1. Get an API key

Create an API key in your OpenAI account. API usage may be billed separately from a ChatGPT subscription.

## 2. Upload to GitHub

1. Download and extract this project ZIP.
2. Create a new, empty repository on GitHub.
3. Upload the extracted **files and folders** to the repository root (not the ZIP file itself).
4. Commit the files.

Do not upload a real `.env` file or API key. `.env.example` is only a template.

## 3. Deploy on Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import your GitHub repository.
3. Vercel should detect Next.js automatically.
4. Before or after deployment, open **Project Settings → Environment Variables**.
5. Add:
   - `OPENAI_API_KEY` = your secret API key
   - `OPENAI_MODEL` = `gpt-4.1-mini` (optional; this is the default)
6. Redeploy after adding or changing environment variables.

## 4. Run locally (optional)

Install a current Node.js LTS release, then from the project folder run:

```bash
npm install
```

Copy `.env.example` to `.env.local`, then replace the placeholder with your real API key.

```bash
npm run dev
```

Open `http://localhost:3000`.

## Customize the chatbot

- **Assistant behaviour:** edit `SYSTEM_INSTRUCTIONS` in `app/api/chat/route.js`.
- **Model:** set `OPENAI_MODEL` in Vercel Environment Variables to a model available to your API account.
- **Brand and UI:** edit `app/page.jsx` and `app/globals.css`.
- **Browser title:** edit `metadata` in `app/layout.jsx`.

## Important notes

- The API route validates incoming message shape and limits the recent conversation to 20 messages.
- For a public production chatbot, consider adding rate limiting, abuse prevention, usage limits, and monitoring to protect your API budget.
- Do not collect sensitive personal information unless you have a clear need and appropriate privacy safeguards.
- A chatbot response is not guaranteed to be correct. Review important information.
