"use client"
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { use } from 'react'


export default function LoginPage({ params }: any) { 
  const { id } : { id: string } = use(params)

  const handleLogin = async () => {
    const callbackUrl = `${window.location.origin}/public/jobs/${id}/apply`
    await signIn('github-candidat', { callbackUrl })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in to Your Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full justify-center" 
            onClick={handleLogin}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
