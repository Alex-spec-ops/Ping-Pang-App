import { redirect } from "next/navigation";

export default function MatchesPendingRedirect() {
  redirect("/feed");
}
