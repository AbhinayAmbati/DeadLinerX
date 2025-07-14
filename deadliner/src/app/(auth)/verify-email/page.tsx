'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { verificationSchema, type VerificationSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { AuthBackground } from '@/components/auth-background';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyEmail, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VerificationSchema>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: VerificationSchema) => {
    try {
      setIsLoading(true);
      await verifyEmail(data.code);
      toast.success('Email verified successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <>
      <AuthBackground />
      <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We sent a verification code to {user.email}
            </p>
          </div>
          <Card className="border-0 shadow-lg dark:shadow-purple-900/20">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="pt-6 pb-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456"
                            maxLength={6}
                            disabled={isLoading}
                            className="text-center text-lg tracking-widest"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement resend verification code
                      toast.success('New verification code sent!');
                    }}
                    disabled={isLoading}
                  >
                    Resend Code
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
} 