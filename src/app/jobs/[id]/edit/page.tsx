import JobForm from '@/components/jobs/JobForm';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';


export default async function EditJobPage({ params } : { params: Promise<{ id: string }> }) {

  const {id} = await params
  const job = await prisma.job.findUnique({
    where: { id: id }
  });
  if (!job) return notFound();

  return (
    <JobForm 
      mode="edit" 
      job={job}
    />
  );
}