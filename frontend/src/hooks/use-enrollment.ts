import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EnrollmentService } from "../services/enrollment.service";
import { useAuth } from "../components/context/AuthContext";
import { UserProfile } from "@/types/auth";

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: EnrollmentService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pendingEnrollments", user?.userId],
      });
      queryClient.setQueryData(
        ["pendingEnrollments", user?.userId],
        (old: any) => [...old, data],
      );
    },
  });
};

export const useGetAcceptedEnrollments = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["acceptedEnrollments", user?.userId],
    queryFn: () => EnrollmentService.getEnrollments("accepted"),
    staleTime: 5000,
    enabled: !!user?.userId,
    retry: false,
  });
};

export const useGetPendingEnrollments = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["pendingEnrollments", user?.userId],
    queryFn: () => EnrollmentService.getEnrollments("pending"),
    staleTime: 5000,
    enabled: !!user?.userId,
    retry: false,
  });
};

export const useClassEnrollments = (classId: string) => {
  return useQuery({
    queryKey: ["classEnrollments", classId, "accepted"],
    queryFn: () =>
      EnrollmentService.getClassroomEnrollments(classId, "accepted"),
    staleTime: 5000,
    enabled: !!classId,
    retry: false,
  });
};

export const useClassEnrollmentRequests = (classId: string) => {
  return useQuery({
    queryKey: ["classEnrollmentRequests", classId, "pending"],
    queryFn: () =>
      EnrollmentService.getClassroomEnrollments(classId, "pending"),
    staleTime: 5000,
    enabled: !!classId,
    retry: false,
  });
};

export const useCancelEnrollmentRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: EnrollmentService.delete,
    onSuccess: (_, classId) => {
      queryClient.setQueryData(
        ["pendingEnrollments", user?.userId],
        (old: any) => {
          return old.filter((request: any) => request.classId !== classId);
        },
      );
    },
  });
};

export const useUpdateEnrollmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      userId,
      status,
    }: {
      classId: string;
      userId: string;
      status: string;
    }) => EnrollmentService.updateStatus(classId,userId, status),
    onSuccess: (data, variables) => {
      // Extract variables
      const { classId, userId } = variables;
      
      // Optimistic updates
      queryClient.setQueryData(
        ["classEnrollmentRequests", classId, "pending"],
        (old: UserProfile[] = []) =>
          old.filter((user) => user.userId != userId),
      );
      queryClient.invalidateQueries({
        queryKey: ["classEnrollmentRequests", classId, "pending"],
      });

      queryClient.setQueryData(
        ["classEnrollments", classId, "accepted"],
        (old: UserProfile[] = []) => [...old, data]
      );
      queryClient.invalidateQueries({
        queryKey: ["classEnrollments", classId, "accepted"],
      });

    },
  });
};
