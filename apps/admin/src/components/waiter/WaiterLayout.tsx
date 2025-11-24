import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ChevronLeft } from '@repo/ui';

interface WaiterLayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backPath?: string;
}

export function WaiterLayout({ children, showBack = false, backPath }: WaiterLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 w-full flex flex-col relative">
        <main className="flex-1 w-full h-full flex flex-col">{children}</main>
        {showBack && (
          <div className="fixed bottom-4 left-4 z-30">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-slate-800 hover:bg-slate-700 text-white"
              onClick={handleBack}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
