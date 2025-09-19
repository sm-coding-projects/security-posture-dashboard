export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Name</label>
              <input 
                type="text" 
                defaultValue="John Doe"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Email</label>
              <input 
                type="email" 
                defaultValue="john@example.com"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Organization</label>
              <input 
                type="text" 
                placeholder="Your company name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Email Notifications</span>
                <p className="text-sm text-muted-foreground">Receive email alerts for security issues</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Weekly Reports</span>
                <p className="text-sm text-muted-foreground">Get weekly security summary reports</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">SSL Expiration Alerts</span>
                <p className="text-sm text-muted-foreground">Alert when SSL certificates are expiring</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">API Keys</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Production API Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  defaultValue="sk-1234567890abcdef"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50">
                  Copy
                </button>
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50">
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
              <p className="text-sm text-red-600 mb-3">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button>
          <button className="px-6 py-2 border rounded-md hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}