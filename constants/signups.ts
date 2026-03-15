export interface IQuestion {
  question: string;
  answer: string[];
  fieldName: string; // required for Campaign Monitor
  type: 'checkbox' | 'dropdown';
}

interface ISignups {
  COUNTRY_LIST: string[];
  QUESTIONS: IQuestion[];
}

const SIGNUPS: ISignups = {
  COUNTRY_LIST: [],
  QUESTIONS: [
    {
      question: 'How would you like to help? (Select any or all that apply)',
      answer: [
        'User Interview with video',
        'User Interview with voice only',
        'Surveys',
        'Focus Groups',
        'UI Testing',
      ],
      fieldName: 'Tags',
      type: 'checkbox',
    },
    {
      question: 'Do you identify as any of the following? (Select any or all that apply)',
      answer: [
        'Journalist',
        'Civil Society/Public Servant',
        'Human Rights Defender',
        'Environmental Rights Defender',
        'Researcher/Academic',
        'Privacy Enthusiast',
        'Open-Source Contributor',
      ],
      fieldName: 'Roles',
      type: 'checkbox',
    },
  ],
};

export default SIGNUPS;
