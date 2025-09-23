'use client'
import { useAuthStore } from '@/store/auth.store'
import React from 'react'

export default function pacientesPage() {
  const { user } = useAuthStore();
  return (
    <div>{user?.email}</div>
  )
}
