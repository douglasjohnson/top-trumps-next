import { FileMetadata, Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';
import { configDotenv } from 'dotenv';
configDotenv();

const bucketId = 'top-trumps';
const storage = new Storage({
  credentials: {
    project_id: process.env.GCP_PROJECT_ID,
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  },
});
const bucket = storage.bucket(bucketId);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const metadata = await new Promise<FileMetadata>((resolve, reject) => {
        const blob = bucket.file(randomUUID(), {});
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        blobStream
          .on('error', (err) => reject(err))
          .on(
            'finish',
            () =>
              new Promise(async () => {
                const [metadata] = await blob.getMetadata();
                resolve(metadata);
              }),
          );
        blobStream.end(buffer);
      });

      return Response.json({ url: metadata.mediaLink }, { status: 201 });
    }
    return Response.json(new Error('File not found'), { status: 500 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
