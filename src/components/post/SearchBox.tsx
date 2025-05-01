"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  //debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  //update the URL when the debounced search value changes
  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/?search=${debouncedSearch}`);
    } else {
      router.push("/");
    }
  }, [debouncedSearch, router]);

  return (
    <Input
      type="text"
      placeholder="Search..."
      className="w-64 lg:w-80 bg-white"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
