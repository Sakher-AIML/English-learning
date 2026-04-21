"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function SignupPage() {
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: any) => {
    e.preventDefault();

    console.log("SIGNUP CLICKED"); // DEBUG

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log(data, error); // DEBUG

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign up</button>
    </form>
  );
}