import LoadingSkeleton from "@/common/shared/loadingSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen w-full justify-center items-center">
      <LoadingSkeleton />
    </div>
  )
}
