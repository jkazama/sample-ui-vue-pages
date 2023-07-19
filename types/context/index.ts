export const ActorRoleType = {
  ANONYMOUS: "ANONYMOUS",
  USER: "USER",
  INTERNAL: "INTERNAL",
  ADMINISTRATOR: "ADMINISTRATOR",
} as const;
export type ActorRoleType = (typeof ActorRoleType)[keyof typeof ActorRoleType];

export const ActionStatusType = {
  UNPROCESSED: "UNPROCESSED",
  PROCESSING: "PROCESSING",
  PROCESSED: "PROCESSED",
  CANCELLED: "CANCELLED",
  ERROR: "ERROR",
};
export type ActionStatusType =
  (typeof ActionStatusType)[keyof typeof ActionStatusType];

export type LoginAccount = {
  id: string;
  name: string;
  roleType: ActorRoleType;
  authorityIds: string[];
};
