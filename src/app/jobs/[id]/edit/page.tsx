import JobForm from '@/components/jobs/JobForm';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';


interface EditJobPageProps {
  params: {
    id: string;
  };
}


export default async function EditJobPage({ params }: EditJobPageProps) {
  
  
  params = await params
  const job = await prisma.job.findUnique({
    where: { id: params.id }
  });
  if (!job) return notFound();

  return (
    <JobForm 
      mode="edit" 
      job={job}
    />
  );
}