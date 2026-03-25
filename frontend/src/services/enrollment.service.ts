import { PendingEnrollments } from "@/types/enrollment";
import { api } from "./api.service";
import { UserProfile } from "@/types/auth";

export const EnrollmentService = {
  create: async (classId: string) => {
    try {
      const res = await api.post<PendingEnrollments>('api/enrollment/create', { classId });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getEnrollments: async (status: string) => {
    try {
      const res = await api.get(`api/enrollment/get`, { 
        params: {
          status
        }
       });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateStatus: async (classId: string, userId: string, status: string) => {
    try {
      const res = await api.patch(`api/enrollment/update/${classId}/${userId}/status`, { status });
      return res.data;
    } catch (err) {
      throw err;
    }
  }, 
  delete: async (classId: string) => {
    try {
      const res = await api.delete(`api/enrollment/delete/${classId}`)
    } catch (err) {
      throw err;
    }
  },
  getClassroomEnrollments: async (classId: string, status: string) => {
    try {
      const res = await api.get<UserProfile[]>(`api/enrollment/classroom/${classId}/users`, {
        params: {
          status
        }
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}