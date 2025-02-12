import { FormEventHandler, ReactElement, useRef, useState } from 'react';

import { Button } from '@/components/ui';
import Container from '@/components/Container';
import { GroupNotice } from '@/components/sections';
import classNames from 'classnames';
import { useScreen } from '@/contexts/screen';

export default function EmailSignup(): ReactElement {
  const { isSmall } = useScreen();

  const [submitted, setSubmitted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const setButtonText = (value: string) => {
    if (null !== buttonRef.current) {
      buttonRef.current.innerText = value;
    }
  };
  const [email, setEmail] = useState('');
  const handleSubscription: FormEventHandler = async (event) => {
    event.preventDefault();
    setButtonText('Subscribing...');
    let response;
    try {
      response = await fetch('/api/email/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      switch (response.status) {
        case 201:
          setEmail('');
          setButtonText('Signed up ✓');
          setSubmitted(true);
          break;
        case 405:
        default:
          setButtonText('Signup failed ✗');
          console.error(
            'Email API Code',
            response.status,
            await response.json()
          );
          setSubmitted(false);
          break;
      }
    } catch (error) {
      response = error;
      setSubmitted(false);
    }
  };
  return (
    <section className="bg-primary text-gray-dark">
      {isSmall && <GroupNotice />}
      <Container
        id="signup"
        classes={classNames('px-8', 'md:px-10', 'lg:py-24')}
      >
        <h3
          className={classNames(
            'text-xl font-bold leading-none mb-2',
            'lg:text-3xl lg:mb-0'
          )}
        >
          Friends don’t let friends use compromised messengers.
        </h3>
        <p className={classNames('leading-none mb-4', 'md:mb-8', 'lg:text-xl')}>
          Sign up to the mailing list and start taking action!
        </p>
        <form onSubmit={handleSubscription}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classNames(
              'block w-5/6 mb-4 text-sm border border-black rounded-sm bg-primary',
              'md:w-1/2',
              'lg:w-2/5',
              'placeholder-black placeholder-opacity-60'
            )}
            required
          />
          <Button
            bgColor="black"
            textColor="primary"
            fontWeight="semibold"
            size="small"
            hoverEffect={false}
            type={'submit'}
            reference={buttonRef}
          >
            Sign up
          </Button>
          {submitted && (
            <span
              className={classNames(
                'block mt-6',
                'md:inline md:mt-0 md:ml-2',
                'lg:ml-4'
              )}
            >
              Thanks! Check your inbox to confirm your subscription.
            </span>
          )}
        </form>
      </Container>
    </section>
  );
}
