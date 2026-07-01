import { redirect } from "next/navigation";
// /admin → redirect to /admin/rooms by default
export default function AdminIndexPage() {
  redirect("/admin/rooms");
}