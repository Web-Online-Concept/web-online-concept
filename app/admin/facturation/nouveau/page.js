"use client"

import { Suspense } from 'react'
import EditDocument from '../[docId]/page'

export const dynamic = 'force-dynamic'

function DocumentContent() {
  return <EditDocument />
}

export default function NewDocument() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DocumentContent />
    </Suspense>
  )
}