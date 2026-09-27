const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add showPassword state
content = content.replace(
  "const [loading, setLoading] = useState(false);",
  "const [loading, setLoading] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);"
);

// 2. Import Eye and EyeOff
content = content.replace(
  "Activity, FileText, LogOut, Calendar",
  "Activity, FileText, LogOut, Calendar, Eye, EyeOff"
);

// 3. Replace the password field with the new UI (which includes the forgot password link)
const oldPasswordBlock = `            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>`;

const newPasswordBlock = `            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength={8} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 pr-10 text-zinc-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>`;

content = content.replace(oldPasswordBlock, newPasswordBlock);

fs.writeFileSync('src/App.tsx', content);
