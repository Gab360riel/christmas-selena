import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useMessages() {
  return useQuery({
    queryKey: [api.messages.list.path],
    queryFn: async () => {
      const res = await fetch(api.messages.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return api.messages.list.responses[200].parse(await res.json());
    },
  });
}
