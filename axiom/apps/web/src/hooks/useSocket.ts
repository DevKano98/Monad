import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { feedSocketUrl } from "../services/websocket.service";
import { useAppStore } from "../stores/app.store";

export function useSocket() {
  const queryClient = useQueryClient();
  const setLastEvent = useAppStore((state) => state.setLastEvent);

  useEffect(() => {
    const socket = new WebSocket(feedSocketUrl());
    socket.onmessage = (message) => {
      const event = JSON.parse(message.data) as { event: string };
      setLastEvent(event.event);
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["crash-map"] });
      void queryClient.invalidateQueries({ queryKey: ["incidents"] });
    };
    return () => socket.close();
  }, [queryClient, setLastEvent]);
}
