import { processContactInquiry } from "@/lib/contact";
import {
  createLegacyContactHandler,
  legacyCorsHeaders,
} from "@/lib/contact-api/legacy-handler";

export async function OPTIONS() {
  return Response.json({}, { headers: legacyCorsHeaders });
}

export const POST = createLegacyContactHandler({
  apiSecret: process.env.APP_API_SECRET,
  process: processContactInquiry,
});
