import Header from '@/components/landingPage/Header'
import Psicologos from '@/components/landingPage/Psicologos'
import { section } from 'motion/react-client'
import React from 'react'

export default function SearchPage() {
  return (
    <section>
      <Header />
      <Psicologos />
    </section>
  )
}
