import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-2">
      {children}
    </label>
  );
};


export const SubmitButton = ({isLoading,text}:{isLoading:boolean,text:string}) => {
  return (
   <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          {text}
          <ArrowRight className="w-5 h-5 ml-2" />
        </>
      )}
    </button>
  );
};

export const SwitchButton = ({link,text1,text2} : {link:string,text1:string,text2:string})=>{
  return(
    <div className="text-center">
        <p className="text-gray-600">
          {text1}{' '}
          <Link
            href={link}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {text2}
          </Link>
        </p>
      </div>
  )
}