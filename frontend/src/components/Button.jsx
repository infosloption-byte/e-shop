import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  onClick, 
  isLoading = false, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  icon: Icon = null,
  disabled = false 
}) {
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100',
    secondary: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 
        transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
}