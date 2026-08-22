import { z } from "zod";
import { invitationSchema } from "../invitation";

export const listMyInvitationsResponseSchema = z.array(invitationSchema);
