import logo from "figma:asset/5c4d77097daf1d5aed62513a3091060d8bfb8686.png";

export function EnsimagLogo({ className = "h-12" }: { className?: string }) {
  return (
    <img 
      src={logo} 
      alt="ENSIMAG - Grenoble INP" 
      className={className}
    />
  );
}