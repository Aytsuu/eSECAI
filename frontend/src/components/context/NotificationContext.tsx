"use client";

import React, { createContext, useEffect, useState, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from "sonner";

interface NotificationProps {
  notifications: any[]
  unreadCount: number
}

export const NotificationContext = createContext<NotificationProps | null>(null);

export const NotificationProvider = ({ children } : { children: React.ReactNode }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (!connection) {
            const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:8080" : process.env.NEXT_PUBLIC_API_URL;
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${baseURL}/hubs/notifications`, {
                    withCredentials: true
                })
                .withAutomaticReconnect()
                .build();

            setConnection(newConnection);
        }
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.on("ReceiveNotification", (notification: any) => {
                        // Add to state
                        setNotifications(prev => [notification, ...prev]);
                        // Show visual alert
                        toast.success(notification.message, { title: notification.title } as any);
                    });
                })
                .catch((e: any) => console.log('Connection failed: ', e));
        }

        return () => {
            if (connection) connection.stop();
        };
    }, [connection]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount: notifications.length }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useAuth must be used within an NotificationProvider");
  }

  return context;
};