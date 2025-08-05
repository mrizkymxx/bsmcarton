
import AppLayout from "@/components/layout/app-layout";

function ProfileContent() {
  return (
    <div className="w-full space-y-4">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your profile details.
          </p>
        </div>
      </div>
      {/* Profile content will go here */}
       <p>This is where your profile settings will be.</p>
    </div>
  )
}

export default function ProfilePage() {
    return (
        <AppLayout>
            <ProfileContent />
        </AppLayout>
    )
}
