import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { type FormEventHandler, type ReactElement, useRef, useState } from 'react';
import Container from '@/components/Container';
import GroupNotice from '@/components/sections/GroupNotice';
import Button from '@/components/ui/Button';
import { useScreen } from '@/contexts/screen';

export default function EmailSignup({
  hideCommunityNotice,
}: {
  hideCommunityNotice?: boolean;
}): ReactElement {
  const t = useTranslations('email');
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
    try {
      const response = await fetch('/api/email/session', {
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
        default:
          setButtonText('Signup failed ✗');
          console.error('Email API Code', response.status, await response.json());
          setSubmitted(false);
          break;
      }
    } catch (error) {
      console.error(error);
      setSubmitted(false);
    }
  };
  return (
    <section className="bg-primary text-gray-dark">
      {isSmall && !hideCommunityNotice ? <GroupNotice /> : null}
      <Container id="signup" classes={classNames('px-8', 'md:px-10', 'lg:py-24')}>
        <h3 className={classNames('mb-2 font-bold text-xl leading-none', 'lg:mb-0 lg:text-3xl')}>
          {t('heading')}
        </h3>
        <p className={classNames('mt-1 mb-6 leading-snug', 'lg:text-xl')}>{t('subheading')}</p>
        <form onSubmit={handleSubscription}>
          <input
            type="email"
            placeholder={t('placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classNames(
              'mb-6 block w-5/6 rounded-sm border border-black bg-primary text-sm',
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
            size="medium"
            hoverEffect={false}
            type={'submit'}
            reference={buttonRef}
          >
            {t('button.text')}
          </Button>
          {submitted && (
            <span className={classNames('mt-6 block', 'md:mt-0 md:ml-2 md:inline', 'lg:ml-4')}>
              {t('submitSuccessConfirm')}
            </span>
          )}
        </form>
      </Container>
    </section>
  );
}
