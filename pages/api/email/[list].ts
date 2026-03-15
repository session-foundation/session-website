import base64 from 'base-64';
import type { NextApiRequest, NextApiResponse } from 'next';

type EmailLists = 'market-research' | 'session';

const cm_ApiKey = process.env.CAMPAIGN_MONITOR_API_KEY;
const cm_BaseUrl = 'https://api.createsend.com/api/v3.2';
const cm_listId = process.env.CAMPAIGN_MONITOR_LIST_MARKET_RESEARCH_ID; // only the market research mailing list is using this API

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

const brevo_ApiKey = process.env.BREVO_API_KEY;
const brevo_BaseUrl = 'https://api.brevo.com/v3';
const brevo_ListId = Number(process.env.BREVO_LIST_ID);

async function makeBrevoRequest(req: NextApiRequest): Promise<Response> {
  const email = req.body.email;
  const body = {
    email,
    listIds: [brevo_ListId],
    updateEnabled: true,
  };

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': brevo_ApiKey!,
    },
    body: JSON.stringify(body),
  };

  return await fetch(`${brevo_BaseUrl}/contacts`, params);
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
    response = await makeBrevoRequest(req);

    // Brevo returns 201 for new contacts, 204 for updated existing contacts
    if (response.status === 201 || response.status === 204) {
      res.status(201).json({ email });
    } else {
      const result = await response.json();
      res.status(response.status).json({ email, message: result.message });
    }
  }
}
