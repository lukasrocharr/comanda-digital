# Deploy backend to Cloud Run and expose through Firebase Hosting

Overview
- Builds the Spring Boot backend into a container and deploys to Cloud Run.
- Configures Firebase Hosting to rewrite `/api/**` requests to the Cloud Run service.

Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated: `gcloud auth login`
- Firebase CLI installed and authenticated: `npm i -g firebase-tools` then `firebase login`
- A Google Cloud project with billing enabled.

Steps
1. Set the project ID and region:

```bash
PROJECT_ID=your-gcp-project-id
REGION=us-central1
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION
```

2. Build and push image with Cloud Build (from `backend` directory):

```bash
cd backend
gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=$REGION
```

This will build the image `gcr.io/$PROJECT_ID/comanda-digital` and deploy to Cloud Run as service `comanda-digital`.

3. (Optional) Test the service URL returned by Cloud Run.

4. Integrate with Firebase Hosting (from project root):

```bash
firebase init hosting
# choose the project and accept public as 'public' or a directory you want
# When asked to rewrite, you can skip; we'll use firebase.json provided.

# Update firebase.json if your Cloud Run region or serviceId are different.
firebase deploy --only hosting
```

Note: `firebase.json` in the repo contains a rewrite mapping `/api/**` to the Cloud Run service `comanda-digital` in `us-central1`. Adjust `serviceId` and `region` if needed.

If you want me to run these commands here, provide the GCP `PROJECT_ID` and confirm you want me to proceed (I cannot authenticate for you). Alternatively I can generate the bcrypt hash and update the seed file so you can deploy with an admin password.
