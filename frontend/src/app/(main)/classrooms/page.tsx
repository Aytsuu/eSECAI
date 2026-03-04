'use client';

import { Plus } from "lucide-react";
import { useAuth } from "../../../components/context/AuthContext";
import { Dialog, DialogFooter, DialogHeader } from "../../../components/ui/dialog";
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { classroomSchema } from "../../../schemas/classroom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useEffect, useState } from "react";
import { useCreateClassroom, useGetClassroomsByUserId } from "../../../hooks/useClassroom";
import { ClassroomResponse } from "../../../types/classroom";
import { enrollmentSchema } from "../../../schemas/enrollment.schema";
import { useCreateEnrollment, useGetEnrolledClasses } from "../../../hooks/useEnrollment";
import Link from "next/link";

export default () => {
  const { user } = useAuth();
  console.log(user)
  const createClassroomForm = useForm<z.infer<typeof classroomSchema>>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const enrollClassForm = useForm<z.infer<typeof enrollmentSchema>>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      classId: "",
    },
  })

  const [isMounted, setIsMounted] = useState(false);
  const [isOpenCreateClassroom, setIsOpenCreateClassroom] = useState(false);
  const [isOpenEnrollClass, setIsOpenEnrollClass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createClassroom } = useCreateClassroom();
  const { mutateAsync: createEnrollment } = useCreateEnrollment();
  const { data: classroomsByUserId } = useGetClassroomsByUserId(user?.userId);
  const { data: enrollmentsByUserId } = useGetEnrolledClasses(user?.userId);

  // Effects
  useEffect(() => {
    setIsMounted(true);
  }, [])

  // Handlers 
  const handleCreateClassroom = async () => {
    try {
      setIsSubmitting(true);
      await createClassroom({
        ...createClassroomForm.getValues(),
        userId: user?.userId
      })

    } catch (err) {
      alert('Failed to create classroom. Please try again.')
    } finally {
      setIsSubmitting(false);
      setIsOpenCreateClassroom(prev => !prev)
    }
  }

  const handleEnrollClass = async () => {
    try {
      setIsSubmitting(true);
      await createEnrollment({
        ...enrollClassForm.getValues(),
        userId: user?.userId
      })
    } catch (err) {
      alert('Failed to create classroom. Please try again.')
    } finally {
      setIsSubmitting(false);
      setIsOpenEnrollClass(false)
    }
  }

  if (!isMounted) return null;

  return (
    <>

    </>
  )
}