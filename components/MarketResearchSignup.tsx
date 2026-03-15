import classNames from 'classnames';
import { type FormEventHandler, type ReactElement, useEffect, useRef, useState } from 'react';
import Container from '@/components/Container';
import Button from '@/components/ui/Button';
import { SIGNUPS } from '@/constants';
import type { IQuestion } from '@/constants/signups';

export default function MarketResearchSignup(): ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const setButtonText = (value: string) => {
    if (null !== buttonRef.current) {
      buttonRef.current.innerText = value;
    }
  };

  const handleSubscription: FormEventHandler = async (event) => {
    event.preventDefault();
    setButtonText('Subscribing...');
    try {
      const response = await fetch('/api/email/market-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country, email, name, roles, tags }),
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
    } catch (_) {
      setSubmitted(false);
    }
  };

  const handleInputUpdate = (input: HTMLInputElement, field: string) => {
    let newState: string[] = [];
    if (input.checked) {
      newState = field === 'Tags' ? [...tags, input.value] : [...roles, input.value];
    } else {
      newState =
        field === 'Tags'
          ? tags.filter((tag) => tag !== input.value)
          : roles.filter((role) => role !== input.value);
    }
    if (field === 'Tags') {
      setTags(newState);
    } else {
      setRoles(newState);
    }
  };

  const renderQuestions = (questions: IQuestion[]) => {
    const styleClasses = classNames('text-sm w-5/6', 'md:w-1/2', 'lg:w-2/5');
    return questions.map((question) => {
      return (
        <fieldset key={question.fieldName} name={question.fieldName} className={classNames('my-3')}>
          <legend className={classNames('mb-2')}>{question.question}</legend>
          {question.type === 'checkbox' ? (
            <div className={classNames('mt-1 flex flex-wrap')}>
              {question.answer.map((item) => {
                return (
                  <span key={item} className={classNames(styleClasses, 'mb-3')}>
                    <input
                      type="checkbox"
                      name={item}
                      value={item}
                      onChange={(event) => {
                        handleInputUpdate(event.target, question.fieldName);
                      }}
                      className={classNames('-mt-1 mr-4')}
                    />
                    {item}
                  </span>
                );
              })}
            </div>
          ) : (
            <select
              id={question.fieldName}
              name={question.fieldName}
              onChange={(_event) => {
                // No questions with dropdowns yet
              }}
              className={classNames(styleClasses)}
              required
            >
              {question.answer.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          )}
        </fieldset>
      );
    });
  };

  useEffect(() => {
    const form = document.querySelector('#research-signup');
    if (form) {
      setCountry('');
      setEmail('');
      setName('');
      setSubmitted(false);

      const inputs = form.querySelectorAll('input');
      // biome-ignore lint/suspicious/noAssignInExpressions: This is the intended behaviour, resets the state
      inputs.forEach((input) => (input.checked = false));

      const selects = form.querySelectorAll('select');
      // biome-ignore lint/suspicious/noAssignInExpressions: This is the intended behaviour, resets the state
      selects.forEach((select) => (select.value = ''));
    }
  }, []);

  return (
    <section className="mb-6 border border-gray-dark text-gray-dark">
      <Container id="research-signup" classes={classNames('px-4', 'md:px-10', 'lg:py-12')}>
        <h3
          className={classNames(
            'mb-2 font-bold text-xl leading-tight',
            'md:text-3xl',
            'lg:mb-4 lg:text-4xl'
          )}
        >
          Join our new research group!
        </h3>
        <p className={classNames('mb-6', 'lg:text-xl')}>
          <span>You can help us make Session the best messenger in the world. </span>
          <span className={classNames('md:block')}>
            Sign up to Session&apos;s market research group now!
          </span>
        </p>
        <form onSubmit={handleSubscription}>
          <div className={classNames('mb-6 flex flex-col justify-center text-md')}>
            <h3 className={classNames('mb-3 font-bold text-xl')}>Questions</h3>
            <label htmlFor="name" className={classNames('mb-2')}>
              Name (or alias)
            </label>
            <input
              type="text"
              name="name"
              placeholder="User"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={classNames(
                'mb-3 block w-5/6 rounded-sm border border-black text-sm',
                'md:w-1/2',
                'lg:w-2/5',
                'placeholder-black placeholder-opacity-60'
              )}
              required
            />

            <label htmlFor="country" className={classNames('mb-2')}>
              Which country are you from?
            </label>
            <input
              type="text"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={classNames(
                'mb-3 block w-5/6 rounded-sm border border-black text-sm',
                'md:w-1/2',
                'lg:w-2/5',
                'placeholder-black placeholder-opacity-60'
              )}
              required
            />

            {renderQuestions(SIGNUPS.QUESTIONS)}
            <label htmlFor="email" className={classNames('mb-2')}>
              Your email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="user@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classNames(
                'block w-5/6 rounded-sm border border-black text-sm',
                'md:w-1/2',
                'lg:w-2/5',
                'placeholder-black placeholder-opacity-60'
              )}
              required
            />
          </div>
          <Button
            bgColor="black"
            textColor="primary"
            fontWeight="semibold"
            size="large"
            hoverEffect={false}
            type={'submit'}
            reference={buttonRef}
          >
            Sign up
          </Button>
          {submitted && (
            <span className={classNames('mt-6 block', 'md:mt-0 md:ml-2 md:inline', 'lg:ml-4')}>
              Thanks! Check your inbox to confirm your subscription.
            </span>
          )}
        </form>
      </Container>
    </section>
  );
}
