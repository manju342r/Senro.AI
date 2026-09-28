import os
import glob

files = glob.glob("src/components/*.tsx")

for file in files:
    with open(file, 'r') as f:
        content = f.read()
        
    # Replace glass artifacts with Linear artifacts
    content = content.replace("bg-[#121212]/80 backdrop-blur-xl", "bg-[#12151C]")
    content = content.replace("bg-zinc-900/60 backdrop-blur-md", "bg-[#12151C]")
    content = content.replace("bg-[#121212]", "bg-[#12151C]")
    content = content.replace("border-white/5", "border-[#222631]")
    content = content.replace("border-zinc-800", "border-[#222631]")
    content = content.replace("border-zinc-800/80", "border-[#222631]")
    content = content.replace("border-zinc-700/50", "border-[#222631]")
    
    # Text colors
    content = content.replace("text-zinc-100", "text-[#F7F8F8]")
    content = content.replace("text-zinc-200", "text-[#E2E4E9]")
    content = content.replace("text-zinc-300", "text-[#E2E4E9]")
    content = content.replace("text-zinc-400", "text-[#8A8F98]")
    content = content.replace("text-zinc-500", "text-[#8A8F98]")
    
    # Backgrounds
    content = content.replace("bg-[#0a0a0a]", "bg-[#08090A]")
    
    # Border radii
    content = content.replace("rounded-2xl", "rounded-lg")
    content = content.replace("rounded-xl", "rounded-lg")
    
    # Shadows
    content = content.replace("shadow-2xl", "shadow-sm shadow-black/20")
    content = content.replace("shadow-lg", "shadow-sm shadow-black/20")
    
    with open(file, 'w') as f:
        f.write(content)

print("Applied Linear color palette across components.")
