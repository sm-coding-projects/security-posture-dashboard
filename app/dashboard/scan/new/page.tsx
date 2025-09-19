export default function NewScanPage() {
  return (
    <div className="space-y-8 p-6 particle-field cyber-grid">
      <div className="relative scene-3d">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 rounded-full blur-3xl floating-animation"></div>

        <h1 className="relative text-5xl md:text-6xl font-black tracking-tight gradient-text mb-4 tilt-3d">
          NEW SECURITY SCAN
        </h1>
        <p className="relative text-lg text-cyan-400 font-bold mb-2 holographic">
          COMPREHENSIVE ASSESSMENT
        </p>
        <p className="relative text-base text-muted-foreground font-medium">
          Launch advanced security analysis for your domain infrastructure.
        </p>
      </div>

      <div className="glass-card border-0 neon-box bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-blue-900/80 backdrop-blur-xl p-8 max-w-2xl card-3d">
        <form className="space-y-8">
          <div>
            <label className="text-sm font-bold text-cyan-400 block mb-3 holographic">TARGET DOMAIN</label>
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
            />
            <p className="text-xs text-gray-400 mt-2 font-mono">
              Enter the domain or URL for security analysis
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-indigo-400 block mb-4 holographic">SCAN MODULES</label>
            <div className="space-y-4">
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="w-5 h-5 bg-green-500/20 border border-green-500/50 rounded-lg mr-4 flex items-center justify-center group-hover:border-green-400">
                  <div className="w-3 h-3 bg-green-500 rounded-sm pulse-glow"></div>
                </div>
                <span className="text-green-400 font-medium group-hover:text-green-300">SSL/TLS Analysis</span>
              </label>
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="w-5 h-5 bg-blue-500/20 border border-blue-500/50 rounded-lg mr-4 flex items-center justify-center group-hover:border-blue-400">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm pulse-glow"></div>
                </div>
                <span className="text-blue-400 font-medium group-hover:text-blue-300">Security Headers</span>
              </label>
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="w-5 h-5 bg-cyan-500/20 border border-cyan-500/50 rounded-lg mr-4 flex items-center justify-center group-hover:border-cyan-400">
                  <div className="w-3 h-3 bg-cyan-500 rounded-sm pulse-glow"></div>
                </div>
                <span className="text-cyan-400 font-medium group-hover:text-cyan-300">DNS Configuration</span>
              </label>
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="sr-only" />
                <div className="w-5 h-5 bg-gray-500/20 border border-gray-500/50 rounded-lg mr-4 flex items-center justify-center group-hover:border-gray-400">
                  <div className="w-3 h-3 bg-transparent rounded-sm"></div>
                </div>
                <span className="text-gray-400 font-medium group-hover:text-gray-300">Vulnerability Scan</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-purple-400 block mb-3 holographic">SCAN PRIORITY</label>
            <select className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200 backdrop-blur-sm">
              <option className="bg-gray-900">Normal Priority</option>
              <option className="bg-gray-900">High Priority</option>
              <option className="bg-gray-900">Low Priority</option>
            </select>
          </div>

          <div className="flex gap-6 pt-4">
            <button
              type="submit"
              className="px-8 py-4 neon-box bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex-1"
            >
              INITIATE SCAN
            </button>
            <button
              type="button"
              className="px-8 py-4 morphism-card border border-indigo-500/30 hover:border-indigo-400/60 text-indigo-400 hover:text-indigo-300 font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              SAVE TEMPLATE
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card border-0 neon-box bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-blue-900/80 backdrop-blur-xl p-8 card-3d">
        <h2 className="text-2xl font-bold text-white mb-6 gradient-text">RECENT SCANS</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
            <div>
              <span className="font-bold text-white">example.com</span>
              <span className="text-gray-400 ml-3 font-mono text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
              <span className="text-green-400 text-sm font-bold">COMPLETED</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
            <div>
              <span className="font-bold text-white">test.org</span>
              <span className="text-gray-400 ml-3 font-mono text-sm">1 day ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
              <span className="text-green-400 text-sm font-bold">COMPLETED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}