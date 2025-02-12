import { NextApiRequest, NextApiResponse } from 'next';

import base64 from 'base-64';

type EmailLists = 'market-research' | 'session';

// #region Campaign Monitor API
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

async function makeCMRequest(req: NextApiRequest): Promise<Response> {
  const email = req.body.email;
  const body: any = {
    EmailAddress: email,
    ConsentToTrack: 'Unchanged',
  };

  const roles = handleCMMultiValueSelect(req.body.roles, 'Roles') ?? [];
  const tags = handleCMMultiValueSelect(req.body.tags, 'Tags') ?? [];

  body['Name'] = req.body.name ? req.body.name : undefined;
  body['CustomFields'] = [
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

  const response = await fetch(
    `${cm_BaseUrl}/subscribers/${cm_listId}.json`,
    params
  );
  return response;
}

// #endregion

// #region Mailerlite API
const ml_ApiKey = process.env.MAILERLITE_API_KEY;
const ml_BaseUrl = 'https://connect.mailerlite.com/api';
const ml_GroupId = process.env.MAILERLITE_GROUP_ID; // the session mailing list is using this API

async function makeMLRequest(req: NextApiRequest): Promise<Response> {
  const email = req.body.email;
  const body = {
    email,
    groups: [ml_GroupId],
  };
  const params = {
    method: 'POST',
    headers: {
      // prevents issues when the API version is updated
      'X-Version': '2025-02-11',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ml_ApiKey}`,
    },
    body: JSON.stringify(body),
  };

  // NOTE request limit is 120 requests per minute https://developers.mailerlite.com/docs/#rate-limits
  // TODO implement batch requests https://developers.mailerlite.com/docs/batching.html
  const response = await fetch(`${ml_BaseUrl}/subscribers`, params);
  return response;
}

// #endregion

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Email API: Invalid http method. | Only POST is accepted.',
    });
  }

  const list: EmailLists = `${req.query.list}` as EmailLists;
  const email = req.body.email;

  let response;

  if (list === 'market-research') {
    response = await makeCMRequest(req);

    if (response.status === 201) {
      res.status(201).json({ email });
    } else {
      const result = await response.json();
      res.status(result.Code).json({ email, message: result.Message });
    }
  } else {
    response = await makeMLRequest(req);
    // 201 Created: The subscriber was successfully added to the list.
    // 200 OK: The subscriber was already in the list.
    if (response.status === 201 || response.status === 200) {
      res.status(201).json({ email });
    } else {
      const result = await response.json();
      res.status(result.code).json({ email, message: result.message });
    }
  }
}
