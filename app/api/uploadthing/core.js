import { getServerSession } from "next-auth";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "../../../lib/authOptions";

const f = createUploadthing();

const getUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the client-side
      // `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
};
