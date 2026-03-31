"use client";

import {
  Plus,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { Dialog, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { classroomSchema } from "@/schemas/classroom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  useCreateClassroom,
  useGetCreatedClassrooms,
} from "@/hooks/use-classroom";
import { ClassroomData } from "@/types/classroom";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ClassroomForm from "./ClassroomForm";
import { queryError } from "@/helpers/errorDisplay";

// ─── Card Components ──────────────────────────────────────────────────────────
function OwnedClassroomCard({ classroom }: { classroom: ClassroomData }) {
  const classNameUrl = classroom.className
    .split(" ")
    .map((c) => c.toLowerCase())
    .join("-");

  return (
    <Card className="relative mx-auto w-full pt-0 overflow-hidden group hover:shadow-md transition-shadow duration-200 border-none bg-muted/40">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={`${classroom.classBanner ? process.env.NEXT_PUBLIC_FILE_BUCKET + "/" + classroom.classBanner : "https://avatar.vercel.sh/shadcn1"}`}
        alt="Classroom Banner"
        className="relative z-20 aspect-video w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
      <CardHeader>
        <CardTitle className="line-clamp-1">{classroom.className}</CardTitle>
        <CardDescription className="line-clamp-2">
          {classroom.classDescription || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link
          href={`/classrooms/${classNameUrl}?id=${classroom.classId}`}
          className="w-full"
        >
          <Button variant="secondary" className="w-full">View Classroom</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ClassroomsContent = () => {
  const { user } = useAuth();

  const createClassForm = useForm<z.infer<typeof classroomSchema>>({
    resolver: zodResolver(classroomSchema),
    defaultValues: { name: "", description: "", bannerFile: "" },
  });

  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [isOpenCreateClassroom, setIsOpenCreateClassroom] =
    React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const { mutateAsync: createClassroom } = useCreateClassroom();
  const { data: createdClassrooms } = useGetCreatedClassrooms();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreateClassroom = async () => {
    if (!(await createClassForm.trigger())) return;
    try {
      setIsSubmitting(true);
      const values = createClassForm.getValues();
      const formData = new FormData();
      formData.append("userId", user?.userId);
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.bannerFile) formData.append("bannerFile", values.bannerFile);
      await createClassroom(formData);
    } catch (err: any) {
      queryError(err);
    } finally {
      setIsSubmitting(false);
      setIsOpenCreateClassroom(false);
      createClassForm.reset();
    }
  };

  if (!isMounted) return null;

  const ownedCount = createdClassrooms?.length ?? 0;

  return (
    <>
      <div className="flex h-full min-h-0 overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-20 max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Classrooms</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your created classes</p>
            </div>
            <Button
              onClick={() => setIsOpenCreateClassroom(true)}
              className="gap-2 shadow-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Classroom</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ownedCount === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No classrooms yet"
                description="Create your first classroom and start teaching or invite students."
              />
            ) : (
              createdClassrooms?.map((classroom: ClassroomData, i: number) => (
                <OwnedClassroomCard key={i} classroom={classroom} />
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={isOpenCreateClassroom}
        onOpenChange={setIsOpenCreateClassroom}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen size={20} className="text-muted-foreground" />
              Create a classroom
            </DialogTitle>
            <DialogDescription>
              Fill in the details to set up your new classroom.
            </DialogDescription>
          </DialogHeader>
          <ClassroomForm form={createClassForm} />
          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsOpenCreateClassroom(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateClassroom} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function Page() {
  return (
    <React.Suspense fallback={<div className="p-10 flex justify-center text-muted-foreground text-sm">Loading...</div>}>
      <ClassroomsContent />
    </React.Suspense>
  );
}
