import { Chrome, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { Separator } from "../ui/separator";


type HeaderProps = {
  data: {
    title: string;
    subtitle: string;
    googleLabel: string;
    githubLabel: string;
  };
};


const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };


const Header = ({data}: HeaderProps) => {
  return (
    <>
    <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
        <p className="mt-2 text-gray-600">
          {data.subtitle}
        </p>
      </div>
      
      {/* Social Login */}
      <div className="space-y-3">
        <button
          onClick={() => handleSocialLogin('google')}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-600 transition-colors"
          >
          <Chrome className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700">{data.googleLabel}</span>
        </button>
        <button
          onClick={() => handleSocialLogin('github')}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-600 transition-colors"
          >
          <Github className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700">{data.githubLabel}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
        </div>
       </div>
    </>
  );
};

export default Header;
