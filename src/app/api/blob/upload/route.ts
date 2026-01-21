import { NextResponse } from "next/server";
import { z } from "zod";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input) as unknown;
  } catch {
    return null;
  }
}

const ClientPayloadSchema = z.object({
  documentId: z.string().cuid(),
  fileName: z.string().optional(),
  fileSize: z.number().int().positive().optional(),
  fileType: z.string().optional(),
});

const TokenPayloadSchema = z.object({
  userId: z.string().cuid(),
  documentId: z.string().cuid(),
  fileName: z.string().optional(),
  fileSize: z.number().int().positive().optional(),
  fileType: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!clientPayload) {
          throw new Error("Missing client payload");
        }

        const parsedClient = ClientPayloadSchema.safeParse(
          safeJsonParse(clientPayload),
        );
        if (!parsedClient.success) {
          throw new Error("Invalid client payload");
        }

        const { documentId, fileName, fileSize, fileType } = parsedClient.data;

        // Verify document ownership (prevents someone attaching uploads to others' docs)
        const doc = await db.document.findFirst({
          where: { id: documentId, userId: session.user.id },
          select: { id: true },
        });
        if (!doc) {
          throw new Error("Document not found");
        }

        return {
          allowedContentTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/png",
            "image/jpeg",
            "image/webp",
          ],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB MVP cap

          // This is returned to us in onUploadCompleted
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            documentId,
            fileName,
            fileSize,
            fileType,
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // tokenPayload is optional in the types, so guard it.
        if (!tokenPayload) {
          console.warn("Upload completed without tokenPayload", {
            url: blob.url,
          });
          return;
        }

        const parsedToken = TokenPayloadSchema.safeParse(
          safeJsonParse(tokenPayload),
        );
        if (!parsedToken.success) {
          console.warn("Invalid tokenPayload", parsedToken.error.flatten());
          return;
        }

        const { userId, documentId, fileName, fileSize, fileType } =
          parsedToken.data;

        // Not all @vercel/blob versions expose contentType/size in PutBlobResult,
        // so we rely on token payload for fileType/fileSize.
        await db.document.updateMany({
          where: { id: documentId, userId },
          data: {
            fileUrl: blob.url,
            filePathname: blob.pathname,
            fileName: fileName ?? blob.pathname.split("/").pop() ?? null,
            fileSize: fileSize ?? null,
            fileType: fileType ?? null,
          },
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
