import { ProtectedPage } from "@/features/finance/protected-page";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProtectedPage view="account" accountId={id} />;
}
