'use client';

import { Form, FormProps } from 'react-aria-components';
import { useFormState } from 'react-dom';

interface ClientFormProps<S, P> extends Omit<FormProps, 'action'> {
  action: Parameters<typeof useFormState<S, P>>[0];
  initialState: Awaited<S>;
}

export default function ClientForm(
  props: ClientFormProps<{ error: string }, FormData>,
) {
  const { action, initialState, children, ...rest } = props;
  const [state, formAction] = useFormState<{ error: string }, FormData>(
    action,
    initialState,
  );

  return (
    <Form {...rest} action={formAction}>
      {children}
      <div>{state.error}</div>
    </Form>
  );
}
