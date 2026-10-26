import { ProtectedPage } from "@/features/finance/protected-page";
export const dynamic = "force-dynamic";
export default function Page() {
  return <ProtectedPage view="categories" />;
}
