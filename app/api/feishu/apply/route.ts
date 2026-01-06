import { NextResponse } from 'next/server';

type ApplyPayload = {
  name?: string;
  age?: number | string | null;
  city?: string;
  contactMobile?: string;
  contactEmail?: string;
  interests?: string[];
};

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';

const getTenantAccessToken = async (appId: string, appSecret: string) => {
  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });

  const data = await response.json();

  if (!response.ok || data.code !== 0) {
    throw new Error(data.msg || 'Failed to fetch tenant access token');
  }

  return data.tenant_access_token as string;
};

export async function POST(request: Request) {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  const appToken = process.env.FEISHU_APP_TOKEN;
  const tableId = process.env.FEISHU_TABLE_ID;

  if (!appId || !appSecret || !appToken || !tableId) {
    return NextResponse.json(
      { error: 'Missing Feishu configuration.' },
      { status: 500 }
    );
  }

  const payload = (await request.json()) as ApplyPayload;
  const name = payload.name?.trim() || '';
  const city = payload.city?.trim() || '';
  const contactMobile = payload.contactMobile?.trim() || '';
  const contactEmail = payload.contactEmail?.trim() || '';
  const interests = Array.isArray(payload.interests) ? payload.interests : [];
  const ageNumber = Number(payload.age);

  if (!name || !city || !contactMobile || !Number.isFinite(ageNumber)) {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  if (ageNumber < 7 || ageNumber > 18) {
    return NextResponse.json({ error: 'Age out of range.' }, { status: 400 });
  }

  try {
    const tenantAccessToken = await getTenantAccessToken(appId, appSecret);
    const fields: Record<string, string | number | string[]> = {
      '学生姓名': name,
      '年龄': ageNumber,
      '城市': city,
      '家长手机 / 微信': contactMobile,
    };

    if (contactEmail) {
      fields['电子邮箱'] = contactEmail;
    }

    if (interests.length > 0) {
      fields['感兴趣的方向'] = interests;
    }

    const response = await fetch(
      `${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tenantAccessToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ fields }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.code !== 0) {
      console.error('Feishu write failed:', {
        status: response.status,
        code: data.code,
        msg: data.msg,
        error: data.error,
      });
      return NextResponse.json(
        { error: data.msg || 'Failed to write record.', code: data.code },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
