'use client'

import { useState } from 'react'
import { MobileNewsPage } from './mobile-news-page'

interface Props {
  initialNews: any[]
  onLoadMore: () => Promise<any[]>
  hasMore: boolean
  loading: boolean
}

export default function MobileNewsPageClient(props: Props) {
  return <MobileNewsPage {...props} />
}