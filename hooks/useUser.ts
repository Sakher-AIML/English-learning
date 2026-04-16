"use client";

import { useUserStore } from "@/store/userStore";

export function useUser() {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  return { profile, setProfile };
}
