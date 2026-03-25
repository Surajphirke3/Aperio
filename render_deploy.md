# Deploying Aperio to Render

This guide explains how to deploy both the Python FastAPI backend and the Next.js frontend to [Render.com](https://render.com).

## 1. Deploying the Backend (Web Service)

1. Go to your Render Dashboard and click **New > Web Service**.
2. Connect your GitHub repository.
3. Choose the `backend/aperio-api` directory as the **Root Directory**.
4. Configure the service:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.api.app:app --host 0.0.0.0 --port $PORT`
5. Click **Advanced > Add Environment Variables** and add your `.env` variables:
   - `FEATHERLESS_API_KEY`, `GROQ_API_KEY`
   - `MONGODB_URL` (Important: Create a free cluster on MongoDB Atlas and paste the connection string here. Do not use localhost)
   - `REDIS_URL` (You can provision a free Redis instance on Render)
   - `CORS_ORIGINS` (Set this to `["*"]` for now, or explicitly to your Render frontend URL)
   - `ENVIRONMENT=production`
   - *Note: You will need to upload your `firebase-credentials.json` to Render using "Secret Files" and point `FIREBASE_CREDENTIALS_PATH` to it.*
6. Click **Create Web Service**. Wait for it to finish and copy the Backend URL it generates.

## 2. Setting up Redis on Render (If needed)
If you don't already have external Redis:
1. Go to Render Dashboard and click **New > Redis**.
2. Give it a name and create the free instance.
3. Copy the "Internal Redis URL" and paste it into your backend's `REDIS_URL` environment variable.

## 3. Deploying the Frontend (Web Service)

Next.js SSR apps should be deployed as a Web Service on Render, not a Static Site.
1. Go back to Render Dashboard and click **New > Web Service**.
2. Connect the same repository.
3. Choose the `frontend` directory as the **Root Directory**.
4. Configure the service:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add Environment Variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Paste the URL of your deployed Python backend here (e.g. `https://aperio-api.onrender.com/v1`). 
     *(This allows the Next.js proxy to dynamically forward /api/ requests to your live backend).*
6. Click **Create Web Service**.

Wait a few minutes, and your frontend will be live and successfully integrated with your Python backend securely in production!
