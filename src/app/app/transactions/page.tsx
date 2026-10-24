import { ProtectedPage } from "@/features/finance/protected-page";
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  return (
    <ProtectedPage
      view="activity"
      initialSearch={
        typeof params.search === "string" ? params.search.slice(0, 300) : ""
      }
    />
  );
}
