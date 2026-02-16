import { SiteContent, User } from '../types';

const parseCsv = (content: string): string[][] => {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  const row: string[] = [];

  const pushCell = () => {
    row.push(current);
    current = '';
  };

  const pushRow = () => {
    rows.push([...row]);
    row.length = 0;
  };

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      pushCell();
      continue;
    }
    if (char === '\n' && !inQuotes) {
      pushCell();
      pushRow();
      continue;
    }
    if (char !== '\r') current += char;
  }

  if (current.length > 0 || row.length > 0) {
    pushCell();
    pushRow();
  }

  return rows;
};

const parseCsvAsRecords = (csv: string): Record<string, string>[] => {
  const rows = parseCsv(csv);
  if (rows.length <= 1) return [];
  const headers = rows[0].map(value => value.trim());
  return rows.slice(1).map(row => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    return record;
  });
};

export const fetchCsvRecords = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo leer CSV (${response.status}).`);
  }
  const csv = await response.text();
  return parseCsvAsRecords(csv);
};

export const mapSheetUsers = (records: Record<string, string>[]): User[] => {
  return records
    .filter(record => record.email)
    .map((record, index) => ({
      id: record.id || `sheet-user-${Date.now()}-${index}`,
      name: record.name || record.email.split('@')[0],
      email: record.email,
      phone: record.phone || '',
      country: record.country || 'Colombia',
      role: (record.role as User['role']) || 'USER',
      provider: 'local',
      isLoggedIn: false,
      password: record.password || undefined
    }));
};

export const mapSheetSiteContent = (records: Record<string, string>[]): Partial<SiteContent> => {
  const asEntries = records.filter(record => record.key);
  const keyed = asEntries.reduce<Record<string, string>>((acc, record) => {
    acc[record.key] = record.value ?? '';
    return acc;
  }, {});

  const toList = (key: string) => (keyed[key] || '').split('|').map(item => item.trim()).filter(Boolean);

  return {
    heroTitle: keyed.heroTitle,
    heroSubtitle: keyed.heroSubtitle,
    heroCta: keyed.heroCta,
    infoTitle: keyed.infoTitle,
    infoBody: keyed.infoBody,
    infoBullets: toList('infoBullets'),
    sponsorsTitle: keyed.sponsorsTitle,
    sponsorsLogos: toList('sponsorsLogos'),
    scholarshipTitle: keyed.scholarshipTitle,
    scholarshipBody: keyed.scholarshipBody,
    scholarshipPrice: keyed.scholarshipPrice,
    scholarshipCta: keyed.scholarshipCta,
    promosTitle: keyed.promosTitle,
    promosBody: keyed.promosBody,
    promosHighlights: toList('promosHighlights'),
    contactTitle: keyed.contactTitle,
    contactBody: keyed.contactBody,
    addressTitle: keyed.addressTitle,
    addressBody: keyed.addressBody,
    legalTitle: keyed.legalTitle,
    legalLinks: toList('legalLinks'),
    hoursTitle: keyed.hoursTitle,
    hoursBody: keyed.hoursBody,
    footerNote: keyed.footerNote,
    bodyFont: keyed.bodyFont,
    headingFont: keyed.headingFont,
    accentColor: keyed.accentColor,
    primaryColor: keyed.primaryColor,
    heroTitleSize: Number(keyed.heroTitleSize || 64),
    heroSubtitleSize: Number(keyed.heroSubtitleSize || 20),
    borderRadius: Number(keyed.borderRadius || 32)
  };
};

export const postSheetsBackendSnapshot = async (url: string, payload: unknown, token: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Webhook rechazó la carga (${response.status}).`);
  }

  return response.json().catch(() => ({}));
};
