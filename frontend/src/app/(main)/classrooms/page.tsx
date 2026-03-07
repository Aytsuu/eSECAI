"use client";

import {
  Plus,
  BookOpen,
  GraduationCap,
  ChevronRight,
  LogIn,
  X,
} from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { Dialog, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { classroomSchema } from "@/schemas/classroom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  useCreateClassroom,
  useGetClassroomsByCreator,
} from "@/hooks/useClassroom";
import { ClassroomData } from "@/types/classroom";
import { enrollmentSchema } from "@/schemas/enrollment.schema";
import {
  useCreateEnrollment,
  useGetEnrolledClasses,
} from "@/hooks/useEnrollment";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import ClassroomForm from "./ClassroomForm";

// Palette constants
const CARD_PALETTE = [
  { bg: "from-violet-600 to-indigo-700", accent: "bg-violet-500" },
  { bg: "from-rose-500 to-pink-700", accent: "bg-rose-400" },
  { bg: "from-emerald-500 to-teal-700", accent: "bg-emerald-400" },
  { bg: "from-amber-500 to-orange-600", accent: "bg-amber-400" },
  { bg: "from-sky-500 to-blue-700", accent: "bg-sky-400" },
  { bg: "from-fuchsia-500 to-purple-700", accent: "bg-fuchsia-400" },
];

function getCardColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return CARD_PALETTE[Math.abs(hash) % CARD_PALETTE.length];
}

function OwnedClassroomCard({ classroom }: { classroom: ClassroomData }) {
  const color = getCardColor(classroom.classId);
  const classNameUrl = classroom.className
    .split(" ")
    .map((c) => c.toLowerCase())
    .join("-");

  return (
    <Link
      href={`/classrooms/${classNameUrl}?id=${classroom.classId}`}
      className="group block"
    >
      <div className="relative overflow-hidden shadow-md hover:shadow-xl border bg-background transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-2xl">
        <img
          className="absolute inset-0 opacity-10"
          src={"/assets/classroom_card_bg.jpeg"}
        />

        {/* Header Banner */}
        <div
          className={`relative bg-linear-to-br ${color.bg} p-4 flex items-end overflow-hidden`}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <img
            className="absolute inset-0 z-1"
            src={`${process.env.NEXT_PUBLIC_FILE_BUCKET}/${classroom.classBanner}`}
          />
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <Badge
                variant="secondary"
                className="text-[10px] font-semibold bg-white/20 text-white border-0 backdrop-blur-sm mb-1"
              >
                Created by you
              </Badge>
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow">
                {classroom.className}
              </h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-3 pb-2 px-4">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
            {classroom.classDescription || "No description provided."}
          </p>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>View Classroom</span>
          </div>
          <ChevronRight
            size={15}
            className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}

function EnrolledClassroomCard({ classroom }: { classroom: ClassroomData }) {
  const color = getCardColor(classroom.classId);
  const creatorName = classroom.creator?.displayName || "Unknown";
  const creatorImage = classroom.creator?.displayImage;
  const creatorInitial = creatorName.charAt(0).toUpperCase();

  return (
    <Link href={`/classrooms/${classroom.classId}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-2xl">
        {/* Header Banner */}
        <div
          className={`relative h-28 bg-linear-to-br ${color.bg} p-4 flex items-end`}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex-1 min-w-0 pr-2">
              <Badge
                variant="secondary"
                className="text-[10px] font-semibold bg-white/20 text-white border-0 backdrop-blur-sm mb-1"
              >
                Enrolled
              </Badge>
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow">
                {classroom.className}
              </h3>
            </div>
            {/* Creator avatar in top-right of banner */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-10 h-10 border-2 border-white/60 shadow-md shrink-0">
                    <AvatarImage src={creatorImage} alt={creatorName} />
                    <AvatarFallback className="text-sm font-bold bg-white/30 text-white">
                      {creatorInitial}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  <p className="font-semibold">{creatorName}</p>
                  <p className="text-muted-foreground">Instructor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Body */}
        <CardContent className="pt-3 pb-2 px-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={creatorImage} alt={creatorName} />
              <AvatarFallback className="text-[10px]">
                {creatorInitial}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground font-medium">
              {creatorName}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
            {classroom.classDescription || "No description provided."}
          </p>
        </CardContent>

        <CardFooter className="px-4 py-3 flex items-center justify-between border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap size={13} />
            <span>View coursework</span>
          </div>
          <ChevronRight
            size={15}
            className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
          />
        </CardFooter>
      </Card>
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}

export default () => {
  const { user } = useAuth();

  const createClassroomForm = useForm<z.infer<typeof classroomSchema>>({
    resolver: zodResolver(classroomSchema),
    defaultValues: { name: "", description: "" },
  });

  const enrollClassForm = useForm<z.infer<typeof enrollmentSchema>>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { classId: "" },
  });

  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [isOpenCreateClassroom, setIsOpenCreateClassroom] =
    React.useState<boolean>(false);
  const [isOpenEnrollClass, setIsOpenEnrollClass] =
    React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const { mutateAsync: createClassroom } = useCreateClassroom();
  const { mutateAsync: createEnrollment } = useCreateEnrollment();
  const { data: classroomsByCreator } = useGetClassroomsByCreator(user?.userId); // Created classes
  const { data: enrollmentsByUserId } = useGetEnrolledClasses(user?.userId); // Enrolled classes

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreateClassroom = async () => {
    try {
      setIsSubmitting(true);
      const values = createClassroomForm.getValues();

      // Initialize FormData
      const formData = new FormData();

      // Append values
      formData.append("userId", user?.userId);
      formData.append("name", values.name);
      formData.append("description", values.description);

      if (values.bannerFile) {
        formData.append("bannerFile", values.bannerFile);
      }

      await createClassroom(formData);
    } catch {
      alert("Failed to create classroom. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsOpenCreateClassroom(false);
      createClassroomForm.reset();
    }
  };

  const handleEnrollClass = async () => {
    try {
      setIsSubmitting(true);
      await createEnrollment({
        ...enrollClassForm.getValues(),
        userId: user?.userId,
      });
    } catch {
      alert("Failed to join classroom. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsOpenEnrollClass(false);
      enrollClassForm.reset();
    }
  };

  if (!isMounted) return null;

  const ownedCount = classroomsByCreator?.length ?? 0;
  const enrolledCount = enrollmentsByUserId?.length ?? 0;

  return (
    <>
      {/* Tabs */}
      <Tabs defaultValue="teaching" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="h-10">
            <TabsTrigger value="teaching" className="gap-2 px-5 cursor-pointer">
              <BookOpen size={14} />
              My Classroom
              {ownedCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px] h-4 min-w-4 justify-center"
                >
                  {ownedCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="enrolled" className="gap-2 px-5 cursor-pointer">
              <GraduationCap size={14} />
              Enrolled
              {enrolledCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px] h-4 min-w-4 justify-center"
                >
                  {enrolledCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          {/* Plus FAB with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <Plus size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer py-2.5"
                onSelect={() => setIsOpenCreateClassroom(true)}
              >
                <BookOpen size={15} />
                <span>Create class</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer py-2.5"
                onSelect={() => setIsOpenEnrollClass(true)}
              >
                <LogIn size={15} />
                <span>Join class</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Teaching Tab */}
        <TabsContent value="teaching">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ownedCount === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No classes yet"
                description="Create your first classroom and start teaching."
              />
            ) : (
              classroomsByCreator?.map(
                (classroom: ClassroomData, index: number) => (
                  <OwnedClassroomCard key={index} classroom={classroom} />
                ),
              )
            )}
          </div>
        </TabsContent>

        {/* Enrolled Tab */}
        <TabsContent value="enrolled">
          <div className="grid grid-cols-1 sm:grid-cols-23 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {enrolledCount === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="Not enrolled in any class"
                description="Join a class using an invite code to get started."
              />
            ) : (
              enrollmentsByUserId?.map((classroom: ClassroomData) => (
                <EnrolledClassroomCard
                  key={classroom.classId}
                  classroom={classroom}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Classroom Dialog */}
      <Dialog
        open={isOpenCreateClassroom}
        onOpenChange={setIsOpenCreateClassroom}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen size={18} />
              Create a classroom
            </DialogTitle>
            <DialogDescription>
              Fill in the details to set up your new classroom.
            </DialogDescription>
          </DialogHeader>

          <ClassroomForm form={createClassroomForm} />

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpenCreateClassroom(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateClassroom}
              disabled={isSubmitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? "Creating..." : "Create class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Classroom Dialog */}
      <Dialog open={isOpenEnrollClass} onOpenChange={setIsOpenEnrollClass}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn size={18} />
              Join a classroom
            </DialogTitle>
            <DialogDescription>
              Enter the class code provided by your instructor.
            </DialogDescription>
          </DialogHeader>
          <Form {...enrollClassForm}>
            <div className="space-y-4 py-2">
              <FormField
                control={enrollClassForm.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. abc123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpenEnrollClass(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEnrollClass} disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
