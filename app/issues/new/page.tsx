'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Button, Callout, TextField } from '@radix-ui/themes';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import 'easymde/dist/easymde.min.css';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { issueSchema } from '@/app/issueValidationSchema';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

// Avoid runtime error: It dynamically import package for client only
const SimpleMdeEditor = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

/*  So this interface is redandant and we have to 
 make changes in places in future So we use zod.infer to make it dynamically use defined schema */
// interface IssueInterface {
//   title: string;
//   description: string;
// }

// here we extracting types from issue schema
type IssueForm = z.infer<typeof issueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({ resolver: zodResolver(issueSchema) });

  const [error, setError] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const onSubmitHandler = handleSubmit(async data => {
    try {
      setIsSubmiting(true);
      await axios.post('/api/issues', data);
      router.push('/issues');
    } catch (error) {
      setIsSubmiting(false);
      setError('Something unexpected happened!');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Icon>
            <AiOutlineInfoCircle />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-5" onSubmit={onSubmitHandler}>
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register('title')} />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMdeEditor placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={isSubmiting}>
          Submit New Issue {isSubmiting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
