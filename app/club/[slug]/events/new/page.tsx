import { redirect } from "next/navigation";

export default function NewEventRedirect() {
  redirect("/club-dashboard/tournaments");
}
