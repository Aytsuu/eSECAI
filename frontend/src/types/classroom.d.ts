import { UserProfile } from "./auth";

export interface ClassroomCreateRequest {
  name: string;
  description: string;
  userId: string;
}

export interface ClassroomData {
  classId: string;
  className: string;
  classDescription: string;
  classCreatedAt: string;
  classBanner: string;
  creator?: UserProfile;
  enrolled_users: UserProfile[]
  posts?: Post[] 
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: UserProfile;
  isPinned?: boolean;
}