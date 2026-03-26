"use client";

import {
  Plus,
  BookOpen,
  GraduationCap,
  LogIn,
  X,
  Clock,
  ChevronRight,
  Inbox,
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
  useGetCreatedClassrooms,
} from "@/hooks/use-classroom";
import { ClassroomData } from "@/types/classroom";
import { enrollmentSchema } from "@/schemas/enrollment.schema";
import {
  useCreateEnrollment,
  useCancelEnrollmentRequest,
  useGetAcceptedEnrollments,
  useGetPendingEnrollments,
} from "@/hooks/use-enrollment";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClassroomForm from "./ClassroomForm";
import { formatDistanceToNow } from "date-fns";
import { PendingEnrollments } from "@/types/enrollment";
import { queryError } from "@/helpers/errorDisplay";
import { useRouter, useSearchParams } from "next/navigation";

// ─── Section types ────────────────────────────────────────────────────────────
type Section = "teaching" | "enrolled";

// ─── Card Components ──────────────────────────────────────────────────────────
function OwnedClassroomCard({ classroom }: { classroom: ClassroomData }) {
  const classNameUrl = classroom.className
    .split(" ")
    .map((c) => c.toLowerCase())
    .join("-");

  return (
    <Card className="relative mx-auto w-full pt-0 overflow-hidden group hover:shadow-md transition-shadow duration-200">
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
          <Button className="w-full">View Classroom</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function EnrolledClassroomCard({ classroom }: { classroom: ClassroomData }) {
  const creatorName = classroom.creator?.displayName || "Unknown";
  const creatorImage = classroom.creator?.displayImage;
  const creatorInitial = creatorName.charAt(0).toUpperCase();
  const classNameUrl = classroom.className
    .split(" ")
    .map((c) => c.toLowerCase())
    .join("-");

  return (
    <Card className="relative mx-auto w-full pt-0 overflow-hidden group hover:shadow-md transition-shadow duration-200">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={`${classroom.classBanner ? process.env.NEXT_PUBLIC_FILE_BUCKET + "/" + classroom.classBanner : "https://avatar.vercel.sh/shadcn1"}`}
        alt="Classroom Banner"
        className="relative z-20 aspect-video w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
      <CardHeader>
        <div className="flex items-center justify-between mb-1">
          <Badge variant="secondary" className="text-[10px]">
            Enrolled
          </Badge>
        </div>
        <CardTitle className="line-clamp-1">{classroom.className}</CardTitle>
        <CardDescription className="line-clamp-2">
          {classroom.classDescription || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={creatorImage} alt={creatorName} />
            <AvatarFallback className="text-[10px]">
              {creatorInitial}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate max-w-20">
            {creatorName}
          </span>
        </div>
        <Link href={`/classrooms/${classNameUrl}?id=${classroom.classId}`}>
          <Button size="sm">View Class</Button>
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
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}

// ─── Pending Requests Sidebar ─────────────────────────────────────────────────
function PendingRequestsSidebar({
  requests,
  isOpen,
  onToggle,
  cancelQueue,
  onCancel,
}: {
  requests: PendingEnrollments[];
  isOpen: boolean;
  onToggle: () => void;
  cancelQueue: string[];
  onCancel: (classId: string) => void;
}) {
  return (
    <div
      className={`
        relative flex flex-col border-l border-border/50 bg-background/80 backdrop-blur-sm
        transition-all duration-300 ease-in-out shrink-0
        ${isOpen ? "w-72" : "w-10"}
      `}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -left-3.5 top-6 z-10 w-7 h-7 rounded-full border border-border/60 bg-background shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        aria-label={
          isOpen ? "Collapse requests panel" : "Expand requests panel"
        }
      >
        <ChevronRight
          size={14}
          className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsed label */}
      {!isOpen && (
        <div className="flex flex-col items-center pt-16 gap-2">
          <span
            className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Pending
          </span>
          {requests.length > 0 && (
            <Badge className="text-[9px] h-4 px-1 bg-amber-500 hover:bg-amber-500 text-white border-0">
              {requests.length}
            </Badge>
          )}
        </div>
      )}

      {/* Expanded panel */}
      {isOpen && (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="px-4 pt-5 pb-3 border-b border-border/40 flex items-center gap-2 shrink-0">
            <Inbox size={14} className="text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase flex-1">
              Pending Requests
            </p>
            {requests.length > 0 && (
              <Badge className="text-[10px] h-4 px-1.5 bg-amber-500 hover:bg-amber-500 text-white border-0">
                {requests.length}
              </Badge>
            )}
          </div>

          <ScrollArea className="flex-1 px-3 py-3">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Clock size={16} className="text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  No pending requests
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {requests.map((request) => (
                  <div
                    key={request.classId}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground line-clamp-1">
                        {request.className}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(request.enrollAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              disabled={cancelQueue.includes(request.classId)}
                              className="cursor-pointer w-6 h-6 shrink-0 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors disabled:opacity-40"
                            >
                              <X size={11} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="text-xs">
                            Withdraw request
                          </TooltipContent>
                        </Tooltip>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Withdraw request?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You'll be removed from the waitlist for{" "}
                            <span className="font-medium text-foreground">
                              {request.className}
                            </span>
                            .
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep it</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => onCancel(request.classId)}
                          >
                            Withdraw
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// ─── Section Nav ──────────────────────────────────────────────────────────────
function SectionNav({
  active,
  onChange,
  ownedCount,
  enrolledCount,
}: {
  active: Section;
  onChange: (s: Section) => void;
  ownedCount: number;
  enrolledCount: number;
}) {
  const items: { id: Section; label: string; icon: any; count: number }[] = [
    {
      id: "teaching",
      label: "My Classrooms",
      icon: BookOpen,
      count: ownedCount,
    },
    {
      id: "enrolled",
      label: "Enrolled",
      icon: GraduationCap,
      count: enrolledCount,
    },
  ];

  return (
    <nav className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 w-fit">
      {items.map(({ id, label, icon: Icon, count }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            relative cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${
              active === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }
          `}
        >
          <Icon size={14} />
          {label}
          {count > 0 && (
            <Badge
              variant={active === id ? "secondary" : "outline"}
              className="ml-0.5 px-1.5 py-0 text-[10px] h-4 min-w-4 justify-center"
            >
              {count}
            </Badge>
          )}
        </button>
      ))}
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ClassroomsContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Persist active section in URL so reload keeps position
  const sectionParam = searchParams.get("section") as Section | null;
  const [activeSection, setActiveSection] = React.useState<Section>(
    sectionParam === "enrolled" ? "enrolled" : "teaching",
  );

  const handleSectionChange = (s: Section) => {
    setActiveSection(s);
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", s);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const createClassForm = useForm<z.infer<typeof classroomSchema>>({
    resolver: zodResolver(classroomSchema),
    defaultValues: { name: "", description: "", bannerFile: "" },
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
  const [cancelQueue, setCancelQueue] = React.useState<string[]>([]);
  const [isPendingPanelOpen, setIsPendingPanelOpen] =
    React.useState<boolean>(true);

  const { mutateAsync: createClassroom } = useCreateClassroom();
  const { mutateAsync: createEnrollment } = useCreateEnrollment();
  const { mutateAsync: cancelEnrollment } = useCancelEnrollmentRequest();
  const { data: createdClassrooms } = useGetCreatedClassrooms();
  const { data: acceptedEnrollments } = useGetAcceptedEnrollments();
  const { data: pendingEnrollments } = useGetPendingEnrollments();

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

  const handleEnrollClass = async () => {
    if (!(await enrollClassForm.trigger())) return;
    try {
      setIsSubmitting(true);
      await createEnrollment(enrollClassForm.getValues().classId);
    } catch (err: any) {
      queryError(err);
    } finally {
      setIsSubmitting(false);
      setIsOpenEnrollClass(false);
      enrollClassForm.reset();
    }
  };

  const handleCancelRequest = async (classId: string) => {
    try {
      setCancelQueue((prev) => [...prev, classId]);
      await cancelEnrollment(classId);
    } catch {
      // handle
    } finally {
      setCancelQueue((prev) => prev.filter((id) => id !== classId));
    }
  };

  if (!isMounted) return null;

  const ownedCount = createdClassrooms?.length ?? 0;
  const enrolledCount = acceptedEnrollments?.length ?? 0;
  const pendingList: PendingEnrollments[] = pendingEnrollments ?? [];

  // Only show pending sidebar on the enrolled tab
  const showPendingSidebar = activeSection === "enrolled";

  return (
    <>
      {/* ── Outer layout: content + collapsible sidebar ── */}
      <div className="flex h-full min-h-0 overflow-hidden">
        {/* ── Main content ── */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-5 pb-16">
          {/* ── Header row ── */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <SectionNav
              active={activeSection}
              onChange={handleSectionChange}
              ownedCount={ownedCount}
              enrolledCount={enrolledCount}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus size={15} />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer py-2.5"
                  onSelect={() => setIsOpenCreateClassroom(true)}
                >
                  <BookOpen size={15} />
                  Create class
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer py-2.5"
                  onSelect={() => setIsOpenEnrollClass(true)}
                >
                  <LogIn size={15} />
                  Join class
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ── Teaching section ── */}
          {activeSection === "teaching" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ownedCount === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No classrooms yet"
                  description="Create your first classroom and start teaching."
                  action={
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => setIsOpenCreateClassroom(true)}
                    >
                      <Plus size={14} /> Create classroom
                    </Button>
                  }
                />
              ) : (
                createdClassrooms?.map(
                  (classroom: ClassroomData, i: number) => (
                    <OwnedClassroomCard key={i} classroom={classroom} />
                  ),
                )
              )}
            </div>
          )}

          {/* ── Enrolled section ── */}
          {activeSection === "enrolled" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {enrolledCount === 0 ? (
                <EmptyState
                  icon={GraduationCap}
                  title="Not enrolled yet"
                  description="Join a class using an invite code to get started."
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setIsOpenEnrollClass(true)}
                    >
                      <LogIn size={14} /> Join a class
                    </Button>
                  }
                />
              ) : (
                acceptedEnrollments?.map(
                  (classroom: ClassroomData, i: number) => (
                    <EnrolledClassroomCard key={i} classroom={classroom} />
                  ),
                )
              )}
            </div>
          )}
        </div>

        {/* ── Collapsible pending requests sidebar (enrolled tab only) ── */}
        {showPendingSidebar && (
          <PendingRequestsSidebar
            requests={pendingList}
            isOpen={isPendingPanelOpen}
            onToggle={() => setIsPendingPanelOpen((prev) => !prev)}
            cancelQueue={cancelQueue}
            onCancel={handleCancelRequest}
          />
        )}
      </div>

      {/* ── Create Classroom Dialog ── */}
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
          <ClassroomForm form={createClassForm} />
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

      {/* ── Join Classroom Dialog ── */}
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

export default () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ClassroomsContent />
    </React.Suspense>
  );
}
