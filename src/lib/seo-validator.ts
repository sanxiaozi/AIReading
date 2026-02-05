/**
 * SEO Validation Utilities
 * 用于验证和检查 SEO 配置的工具函数
 */

import { Metadata } from 'next'

/**
 * SEO 验证结果接口
 */
export interface SEOValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  tips: string[]
}

/**
 * 验证 Title 标签
 */
export function validateTitle(title: string | undefined, locale: 'en' | 'zh'): string[] {
  const errors: string[] = []
  
  if (!title) {
    errors.push('Title is required')
    return errors
  }

  const maxLength = locale === 'zh' ? 30 : 60
  const minLength = 10

  if (title.length < minLength) {
    errors.push(`Title is too short (${title.length} chars). Minimum: ${minLength}`)
  }

  if (title.length > maxLength) {
    errors.push(`Title is too long (${title.length} chars). Maximum: ${maxLength} for ${locale}`)
  }

  if (!title.includes('|') && !title.includes('-')) {
    errors.push('Consider adding brand name to title (e.g., "Page Title | Brand")')
  }

  return errors
}

/**
 * 验证 Description 标签
 */
export function validateDescription(description: string | undefined, locale: 'en' | 'zh'): string[] {
  const errors: string[] = []
  
  if (!description) {
    errors.push('Description is required')
    return errors
  }

  const maxLength = locale === 'zh' ? 80 : 160
  const minLength = locale === 'zh' ? 50 : 100

  if (description.length < minLength) {
    errors.push(`Description is too short (${description.length} chars). Minimum: ${minLength}`)
  }

  if (description.length > maxLength) {
    errors.push(`Description is too long (${description.length} chars). Maximum: ${maxLength} for ${locale}`)
  }

  return errors
}

/**
 * 验证 Keywords
 */
export function validateKeywords(keywords: string | string[] | undefined): string[] {
  const warnings: string[] = []
  
  if (!keywords) {
    warnings.push('Keywords are optional but recommended')
    return warnings
  }

  const keywordArray = Array.isArray(keywords) 
    ? keywords 
    : keywords.split(',').map(k => k.trim())

  if (keywordArray.length > 10) {
    warnings.push(`Too many keywords (${keywordArray.length}). Recommended: 5-10`)
  }

  if (keywordArray.length < 3) {
    warnings.push(`Too few keywords (${keywordArray.length}). Recommended: 5-10`)
  }

  return warnings
}

/**
 * 验证 Canonical URL
 */
export function validateCanonicalUrl(url: string | undefined): string[] {
  const errors: string[] = []
  
  if (!url) {
    errors.push('Canonical URL is required')
    return errors
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    errors.push('Canonical URL must be absolute (include protocol)')
  }

  if (!url.endsWith('/') && !url.includes('.')) {
    errors.push('Canonical URL should end with trailing slash')
  }

  try {
    new URL(url)
  } catch {
    errors.push('Invalid URL format')
  }

  return errors
}

/**
 * 验证 Open Graph Image
 */
export function validateOGImage(imageUrl: string | undefined): string[] {
  const warnings: string[] = []
  
  if (!imageUrl) {
    warnings.push('OG Image is highly recommended for social sharing')
    return warnings
  }

  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    warnings.push('OG Image URL should be absolute')
  }

  if (!imageUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
    warnings.push('OG Image should be JPG, PNG, or WebP format')
  }

  return warnings
}

/**
 * 验证 JSON-LD Schema
 */
export function validateJSONLD(jsonld: any): string[] {
  const errors: string[] = []
  
  if (!jsonld) {
    errors.push('JSON-LD schema is missing')
    return errors
  }

  if (!jsonld['@context']) {
    errors.push('JSON-LD missing @context')
  }

  if (!jsonld['@type']) {
    errors.push('JSON-LD missing @type')
  }

  // Book specific validation
  if (jsonld['@type'] === 'Book') {
    if (!jsonld.name) errors.push('Book schema missing "name"')
    if (!jsonld.author) errors.push('Book schema missing "author"')
  }

  // WebSite specific validation
  if (jsonld['@type'] === 'WebSite') {
    if (!jsonld.name) errors.push('WebSite schema missing "name"')
    if (!jsonld.url) errors.push('WebSite schema missing "url"')
  }

  return errors
}

/**
 * 验证完整的 Metadata 对象
 */
export function validateMetadata(metadata: Metadata, locale: 'en' | 'zh'): SEOValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const tips: string[] = []

  // Validate title
  const title = typeof metadata.title === 'string' 
    ? metadata.title 
    : (metadata.title && typeof metadata.title === 'object' && 'absolute' in metadata.title ? metadata.title.absolute : undefined) 
      || (metadata.title && typeof metadata.title === 'object' && 'default' in metadata.title ? metadata.title.default : undefined)
  errors.push(...validateTitle(title, locale))

  // Validate description
  errors.push(...validateDescription(metadata.description || undefined, locale))

  // Validate keywords
  warnings.push(...validateKeywords(metadata.keywords ?? undefined))

  // Validate canonical
  const canonical = metadata.alternates?.canonical
  if (canonical) {
    const canonicalStr = typeof canonical === 'string' 
      ? canonical 
      : canonical instanceof URL 
        ? canonical.toString() 
        : (canonical as { url?: string | URL })?.url?.toString()
    errors.push(...validateCanonicalUrl(canonicalStr))
  } else {
    warnings.push('Canonical URL is missing')
  }

  // Validate Open Graph
  if (!metadata.openGraph) {
    warnings.push('Open Graph tags are missing')
  } else {
    const ogImage = metadata.openGraph.images
    if (!ogImage || (Array.isArray(ogImage) && ogImage.length === 0)) {
      warnings.push(...validateOGImage(undefined))
    } else {
      const firstImage = Array.isArray(ogImage) ? ogImage[0] : ogImage
      const imageUrl = typeof firstImage === 'string' 
        ? firstImage 
        : (firstImage && typeof firstImage === 'object' && 'url' in firstImage 
            ? (firstImage as { url: string | URL }).url?.toString() 
            : undefined)
      warnings.push(...validateOGImage(imageUrl))
    }
  }

  // Validate Twitter Card
  if (!metadata.twitter) {
    warnings.push('Twitter Card tags are missing')
  }

  // Add tips
  if (errors.length === 0 && warnings.length === 0) {
    tips.push('✅ All SEO checks passed!')
    tips.push('Consider adding structured data (Schema.org) for better search results')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    tips,
  }
}

/**
 * 在开发环境中打印 SEO 验证结果
 */
export function logSEOValidation(
  pageName: string, 
  metadata: Metadata, 
  locale: 'en' | 'zh'
): void {
  if (process.env.NODE_ENV !== 'development') return

  const result = validateMetadata(metadata, locale)
  
  console.group(`🔍 SEO Validation: ${pageName}`)
  
  if (result.errors.length > 0) {
    console.group('❌ Errors')
    result.errors.forEach(error => console.error(`  - ${error}`))
    console.groupEnd()
  }
  
  if (result.warnings.length > 0) {
    console.group('⚠️  Warnings')
    result.warnings.forEach(warning => console.warn(`  - ${warning}`))
    console.groupEnd()
  }
  
  if (result.tips.length > 0) {
    console.group('💡 Tips')
    result.tips.forEach(tip => console.info(`  - ${tip}`))
    console.groupEnd()
  }
  
  console.groupEnd()
}

/**
 * 生成 SEO 报告（可用于 CI/CD）
 */
export function generateSEOReport(pages: Array<{
  name: string
  metadata: Metadata
  locale: 'en' | 'zh'
}>): {
  totalPages: number
  passedPages: number
  failedPages: number
  details: Array<{
    name: string
    result: SEOValidationResult
  }>
} {
  const details = pages.map(page => ({
    name: page.name,
    result: validateMetadata(page.metadata, page.locale),
  }))

  const passedPages = details.filter(d => d.result.isValid).length
  const failedPages = details.filter(d => !d.result.isValid).length

  return {
    totalPages: pages.length,
    passedPages,
    failedPages,
    details,
  }
}

/**
 * URL 规范化验证
 */
export function validateUrlStructure(url: string): string[] {
  const warnings: string[] = []
  
  // Check for trailing slash
  if (!url.endsWith('/') && !url.includes('.') && !url.includes('?')) {
    warnings.push('URL should end with trailing slash for consistency')
  }
  
  // Check for uppercase letters
  if (url !== url.toLowerCase()) {
    warnings.push('URL should be lowercase')
  }
  
  // Check for special characters
  if (url.match(/[^a-z0-9\-\/._~:?#\[\]@!$&'()*+,;=]/i)) {
    warnings.push('URL contains special characters that should be encoded')
  }
  
  // Check for double slashes (除了协议后的 //)
  if (url.replace(/^https?:\/\//, '').includes('//')) {
    warnings.push('URL contains double slashes')
  }
  
  return warnings
}

/**
 * 批量验证 URL 列表
 */
export function validateSitemap(urls: string[]): {
  valid: string[]
  invalid: Array<{ url: string; issues: string[] }>
} {
  const valid: string[] = []
  const invalid: Array<{ url: string; issues: string[] }> = []
  
  urls.forEach(url => {
    const issues = validateUrlStructure(url)
    if (issues.length === 0) {
      valid.push(url)
    } else {
      invalid.push({ url, issues })
    }
  })
  
  return { valid, invalid }
}
