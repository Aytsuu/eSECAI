"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { useDeleteClassroom, useGetClassroomData, useUpdateClassroom } from "@/hooks/useClassroom";
import { Button } from "@/components/ui/button";
import { useUpdateStatus } from "@/hooks/useEnrollment";
import React from "react";
import Protected from "@/components/route/protected";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreVertical,
  LogOut,
  Trash2,
  FileText,
  Users,
  BookOpen,
  Send,
  CalendarDays,
  Pin,
  Pen,
} from "lucide-react";
import { UserProfile } from "@/types/auth";
import { Post } from "@/types/classroom";
import { formatDate } from "@/helpers/dateFormatter";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import z from "zod";
import { classroomSchema } from "@/schemas/classroom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ClassroomForm from "../ClassroomForm";
import axios from "axios";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 border border-border/50">
            <AvatarImage src={post.author?.displayImage} />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(post.author?.displayName ?? "?")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">
                {post.author?.displayName}
              </span>
              {post.isPinned && (
                <Badge
                  variant="secondary"
                  className="text-[10px] h-4 px-1.5 gap-1"
                >
                  <Pin size={9} /> Pinned
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <CalendarDays size={10} />
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyPosts() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <FileText size={26} className="text-muted-foreground" />
      </div>
      <p className="font-semibold text-base mb-1">No posts yet</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        Share an announcement, resource, or assignment with your class.
      </p>
    </div>
  );
}

export default () => {
  // Hooks & States
  const { user } = useAuth();
  const router = useRouter();
  const urlParams = useSearchParams();
  const classId = urlParams.get("id") as string;

  const form = useForm<z.infer<typeof classroomSchema>>({
      resolver: zodResolver(classroomSchema),
      defaultValues: { name: "", description: "" },
    });

  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [showClassroomDialog, setShowClassroomDialog] = React.useState<boolean>(false);
  const [isUpdatingClassroom, setIsUpdatingClassroom] = React.useState<boolean>(false);
  const [showLeaveDialog, setShowLeaveDialog] = React.useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [showNewPostDialog, setShowNewPostDialog] =
    React.useState<boolean>(false);
  const [postContent, setPostContent] = React.useState<string>("");
  const [isSubmittingPost, setIsSubmittingPost] =
    React.useState<boolean>(false);

  const { mutateAsync: updateStatus } = useUpdateStatus();
  const { mutateAsync: deleteClassroom } = useDeleteClassroom();
  const { mutateAsync: updateClassroom } = useUpdateClassroom();
  const { data: classroomData, error } = useGetClassroomData(
    classId,
    user?.userId,
  );

  // Flags
  const hasUpdate = form.formState.isDirty

  // Effects
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    // This only runs once, even in Strict Mode
    if (!classId) {
      toast.error("Page not found");
      router.replace("/classrooms");
    }
  }, [isMounted, classId, router]); // Run when classId is evaluated

  React.useEffect(() => {
    if (!classroomData) 
      return;

    form.reset({
      name: classroomData.className,
      description: classroomData.classDescription,
      bannerFile: `${process.env.NEXT_PUBLIC_FILE_BUCKET}/${classroomData.classBanner}`
    }, { keepDirty: false});
  }, [classroomData, showClassroomDialog])

  const isCreator = user?.userId === classroomData?.creator?.userId;

  // Handlers
  const handleUpdateClassroom = async () => {
    if (!hasUpdate) {
      toast.info("No changes were made");
      setIsUpdatingClassroom(false);
      return;
    }

    try {
      setIsUpdatingClassroom(true);
      const updatedFields: any = form.formState.dirtyFields;
      const formData = new FormData();
      const values = form.getValues();

      // Add to form data only the updated fields
      Object.entries(values).forEach(([key, value]) => {
        if (updatedFields[key]){
          formData.append(key, value);
        }
      });

      await updateClassroom({
        classId: classId,
        data: formData
      });

      setShowClassroomDialog(false);
      toast.success("Successfully updated classroom");
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data)
      }
    } finally {
      setIsUpdatingClassroom(false);
    }
  }

  const handleLeaveClass = async () => {
    try {
      await updateStatus({ classId, userId: user?.userId });
      router.replace("/classrooms");
    } catch {
      alert("Failed to update enrollment status. Please try again.");
    }
  };

  const handleRemoveClassroom = async () => {
    try {
      await deleteClassroom(classId);
      router.back();
    } catch {
      alert("Failed to remove classroom. Please try again.");
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    try {
      setIsSubmittingPost(true);
      setPostContent("");
      setShowNewPostDialog(false);
    } catch {
      alert("Failed to create post.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  if (!isMounted || !classId) return null;

  const data = classroomData;
  const posts: Post[] = data?.posts ?? [];
  const enrolledUsers: UserProfile[] = data?.enrolled_users ?? [];
  const bannerUrl = data?.classBanner;

  return (
    <Protected error={error}>
      <div className="max-w-6xl mx-auto pb-16 space-y-8">
        {/* ── Banner ── */}
        <div className="relative w-full h-52 md:h-64 rounded-2xl overflow-hidden shadow-lg">
          {bannerUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_FILE_BUCKET}/${bannerUrl}`}
              alt="Class banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-violet-600 via-indigo-600 to-blue-700" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Banner content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 flex items-end justify-between">
            <div>
              <Badge className="mb-2 bg-white/15 text-white border-0 backdrop-blur-sm text-[11px]">
                <BookOpen size={10} className="mr-1" />
                Classroom
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md leading-tight">
                {data?.className}
              </h1>
              {data?.classDescription && (
                <p className="text-sm text-white/75 mt-1 max-w-lg line-clamp-1">
                  {data.classDescription}
                </p>
              )}
              <p className="text-xs text-white/50 mt-1.5 flex items-center gap-1">
                <CalendarDays size={11} />
                Created {formatDate(data?.classCreatedAt ?? "")}
              </p>
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 rounded-full w-9 h-9 backdrop-blur-sm"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onSelect={() => setShowClassroomDialog(true)}
                >
                  <Pen />
                  Edit Classroom
                </DropdownMenuItem>
                {isCreator ? (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                    onSelect={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 size={14} />
                    Delete classroom
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                    onSelect={() => setShowLeaveDialog(true)}
                  >
                    <LogOut size={14} />
                    Leave class
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Main layout: Feed + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mt-2">
          {/* ── Left: Post feed ── */}
          <div className="space-y-4">
            {/* New post trigger */}
            {isCreator && (
              <button
                onClick={() => setShowNewPostDialog(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border/50 bg-card/60 hover:bg-muted/40 transition-colors text-left shadow-sm"
              >
                <Avatar className="w-8 h-8 border border-border/50">
                  <AvatarImage src={user?.displayImage} />
                  <AvatarFallback className="text-xs font-semibold">
                    {getInitials(user?.displayName ?? "")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Share something with your class…
                </span>
              </button>
            )}

            {/* Posts */}
            {posts.length === 0 ? (
              <EmptyPosts />
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-4">
            {/* Class code card */}
            {isCreator && (
              <div className="p-5 border bg-background rounded-xl space-y-3">
                <p className="text-xs font-semibold text-muted-foreground tracking-wide">
                  CLASS CODE
                </p>
                <div className="space-y-1">
                  <p
                    className="text-2xl font-bold tracking-widest text-foreground font-mono cursor-pointer"
                    onClick={async (e) => {
                      if (data?.classId) {
                        try {
                          // Use the modern Clipboard API
                          await navigator.clipboard.writeText(data.classId);
                          toast("Copied to clipboard!");
                        } catch (err) {
                          toast.error("Failed to copy");
                        }
                      }
                    }}
                  >
                    {data?.classId?.slice(0, 6).toUpperCase()}...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click to copy full code. Share this code with students to join.
                  </p>
                </div>
              </div>
            )}

            {/* Students card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wide flex items-center gap-1.5">
                    <Users size={12} />
                    STUDENTS
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                    {enrolledUsers.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {enrolledUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 text-center">
                    No students enrolled yet.
                  </p>
                ) : (
                  <ScrollArea className="max-h-64">
                    <TooltipProvider>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {enrolledUsers.map((u) => (
                          <Tooltip key={u.userId}>
                            <TooltipTrigger asChild>
                              <Avatar className="w-9 h-9 border-2 border-background ring-1 ring-border/50 cursor-default hover:scale-110 transition-transform">
                                <AvatarImage src={u.displayImage} />
                                <AvatarFallback className="text-[10px] font-bold">
                                  {getInitials(u.displayName ?? "?")}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              <p className="font-semibold">{u.displayName}</p>
                              <p className="text-muted-foreground">{u.email}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Classroom Form Dialog ── */}
      <Dialog
        open={showClassroomDialog}
        onOpenChange={setShowClassroomDialog}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen size={18} />
              Update a classroom
            </DialogTitle>
            <DialogDescription>
              Change your classroom details and save your changes.
            </DialogDescription>
          </DialogHeader>

          <ClassroomForm form={form} />

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClassroomDialog(false)}
              disabled={isUpdatingClassroom}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateClassroom}
              disabled={isUpdatingClassroom}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isUpdatingClassroom ? "Updating..." : "Update class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── New Post Dialog ── */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={16} />
              New post
            </DialogTitle>
            <DialogDescription>
              Share an announcement, resource, or update with your class.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 py-1">
            <Avatar className="w-8 h-8 mt-0.5 border border-border/50 shrink-0">
              <AvatarImage src={user?.displayImage} />
              <AvatarFallback className="text-xs font-semibold">
                {getInitials(user?.displayName ?? "")}
              </AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Write something for your class…"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="resize-none min-h-30 border-0 bg-muted/40 rounded-xl focus-visible:ring-1 text-sm"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNewPostDialog(false)}
              disabled={isSubmittingPost}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={isSubmittingPost || !postContent.trim()}
              className="gap-2"
            >
              <Send size={14} />
              {isSubmittingPost ? "Posting…" : "Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Leave Dialog ── */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave classroom?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll lose access to all posts and materials in this class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleLeaveClass}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete classroom?</AlertDialogTitle>
            <AlertDialogDescription>
              This is permanent. All posts and enrollments will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRemoveClassroom}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Protected>
  );
};
