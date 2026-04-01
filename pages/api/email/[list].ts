import base64 from 'base-64';
import type { NextApiRequest, NextApiResponse } from 'next';

type EmailLists = 'market-research' | 'session';

const cm_ApiKey = process.env.CAMPAIGN_MONITOR_API_KEY;
const cm_BaseUrl = 'https://api.createsend.com/api/v3.2';
const cm_listId = process.env.CAMPAIGN_MONITOR_LIST_MARKET_RESEARCH_ID; // only the market research mailing list is using this API

const emailListUrl = process.env.EMAIL_LIST_URL ?? 'https://getsession.org/api/subscribe';

// Multi-Valued Select Many custom fields are set by providing multiple Custom Field array items with the same key.
// https://www.campaignmonitor.com/api/v3-3/subscribers/#adding-a-subscriber
function handleCMMultiValueSelect(arr: string[], field: string) {
  if (arr) {
    return arr.map((value: string) => {
      return {
        Key: field,
        Value: value,
      };
    });
  }
}

type CMRequest = {
  EmailAddress: string;
  ConsentToTrack: string;
  Name?: string;
  CustomFields?: Array<Record<string, string>>;
};

async function makeCMRequest(req: NextApiRequest): Promise<Response> {
  const email = req.body.email;
  const body: CMRequest = {
    EmailAddress: email,
    ConsentToTrack: 'Unchanged',
  };

  const roles = handleCMMultiValueSelect(req.body.roles, 'Roles') ?? [];
  const tags = handleCMMultiValueSelect(req.body.tags, 'Tags') ?? [];

  body.Name = req.body.name ? req.body.name : undefined;
  body.CustomFields = [
    req.body.country && {
      Key: 'Country',
      Value: req.body.country,
    },
    ...roles,
    ...tags,
  ];

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${base64.encode(`${cm_ApiKey}:x`)}`,
    },
    body: JSON.stringify(body),
  };

  return await fetch(`${cm_BaseUrl}/subscribers/${cm_listId}.json`, params);
}

async function makeEmailListRequest(req: NextApiRequest): Promise<Response> {
  const email = req.body.email;

  return await fetch(emailListUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Email API: Invalid http method. | Only POST is accepted.',
    });
  }

  const list: EmailLists = `${req.query.list}` as EmailLists;
  const email = req.body.email;

  let response: Response;

  if (list === 'market-research') {
    response = await makeCMRequest(req);

    if (response.status === 201) {
      res.status(201).json({ email });
    } else {
      const result = await response.json();
      res.status(result.Code).json({ email, message: result.Message });
    }
  } else {
    response = await makeEmailListRequest(req);

    if (response.status === 200) {
      res.status(201).json({ email });
    } else {
      const result = await response.json();
      res.status(response.status).json({ email, message: result.error });
    }
  }
}
