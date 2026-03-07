import { ClassroomData } from "../types/classroom";
import { api } from "./api.service";

export const ClassroomService = {
  create: async (data: FormData) => {
    try {
      const res = await api.post('api/classroom/create', data, {
        headers: {
          "Content-Type" : "multipart/form-data"
        }
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getByCreator: async (userId: string) => {
    try {
      const res = await api.get<ClassroomData[]>(`api/classroom/get/creator-${userId}`)
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getData: async (classId: string, userId: string) => {
    try {
      const res = await api.get<ClassroomData>(`api/classroom/get/${classId}/${userId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  delete: async (classId: string) => {
    try {
      const res = await api.delete(`api/classroom/delete/${classId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  update: async (classId: string, data: FormData) => {
    try {
      const res = await api.patch(`api/classroom/patch/${classId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}