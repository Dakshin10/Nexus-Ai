# Step-by-Step Gmail API Setup Guide

Follow these steps to configure your Google Cloud Project and obtain the necessary credentials for the backend.

## 1. Google Cloud Console Configuration

1. **Create a Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Click the project dropdown and select **"New Project"**.
   - Name it (e.g., `Nexus Gmail`) and click **Create**.

2. **Enable Gmail API**:
   - In the sidebar, go to **APIs & Services > Library**.
   - Search for **"Gmail API"**.
   - Click on it and then click **Enable**.

3. **Configure OAuth Consent Screen**:
   - Go to **APIs & Services > OAuth consent screen**.
   - Choose **External** (unless you have a Google Workspace organization) and click **Create**.
   - Fill in the required fields:
     - **App name**: `Nexus`
     - **User support email**: Your email
     - **Developer contact info**: Your email
   - Click **Save and Continue**.
   - On the **Scopes** page, click **Add or Remove Scopes**.
   - Search for `https://www.googleapis.com/auth/gmail.readonly` and add it.
   - On the **Test users** page, add your own email address as a test user.

4. **Create OAuth 2.0 Credentials**:
   - Go to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth client ID**.
   - Select **Application type**: `Web application`.
   - **Name**: `Nexus Backend`.
   - **Authorized redirect URIs**: Add `http://localhost:3000/oauth2callback`.
   - Click **Create**.
   - **IMPORTANT**: Copy the **Client ID** and **Client Secret** immediately.

## 2. Backend Configuration

1. **Update .env**:
   - Open the `.env` file in the project root.
   - Paste your `CLIENT_ID` and `CLIENT_SECRET` into the respective fields.

2. **Install Dependencies**:
   - Open your terminal in the project directory.
   - Run: `npm install`.

3. **Start the Server**:
   - Run: `npm start`.

4. **Authentication Flow**:
   - Open your browser and go to `http://localhost:3000/auth`.
   - Log in with your Google account and grant the requested permissions.
   - Once redirected to the success page, your tokens are saved in `token.json`.

5. **Fetch Emails**:
   - Go to `http://localhost:3000/emails` to see the JSON output of your last 5 emails.
