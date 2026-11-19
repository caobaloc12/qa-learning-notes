/**
 * Single source of truth for the documentation structure.
 *
 * Every page lives at the same slug in each locale:
 *   /guide/qa-test-report      (English)
 *   /vi/guide/qa-test-report   (Vietnamese)
 *
 * To add a page: add its entry here, then create the matching .md files
 * in docs/ and docs/vi/. The sidebar and both locales update automatically.
 */
export type Locale = 'en' | 'vi'

interface DocEntry {
  /** Path inside docs/, without locale prefix or .md extension. */
  slug: string
  label: Record<Locale, string>
}

interface DocGroup {
  group: Record<Locale, string>
  items: DocEntry[]
}

export const docGroups: DocGroup[] = [
  {
    group: { en: 'Foundations', vi: 'Nền tảng' },
    items: [
      {
        slug: 'guide/qa-test-report',
        label: {
          en: 'Writing QA test reports',
          vi: 'Viết báo cáo kiểm thử QA'
        }
      }
    ]
  },
  {
    group: { en: 'Testing practice', vi: 'Thực hành kiểm thử' },
    items: [
      {
        slug: 'guide/test-types',
        label: {
          en: 'Test types',
          vi: 'Các loại kiểm thử'
        }
      }
    ]
  },
  {
    group: { en: 'Test layers', vi: 'Tầng kiểm thử' },
    items: [
      {
        slug: 'guide/ui-vs-api-test-reports',
        label: {
          en: 'UI vs API test reports',
          vi: 'Báo cáo kiểm thử UI và API'
        }
      }
    ]
  }
]

export function sidebar(locale: Locale) {
  const prefix = locale === 'vi' ? '/vi' : ''
  return docGroups.map((group) => ({
    text: group.group[locale],
    items: group.items.map((item) => ({
      text: item.label[locale],
      link: `${prefix}/${item.slug}`
    }))
  }))
}
