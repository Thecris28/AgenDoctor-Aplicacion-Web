import Banner from "@/components/ui/Banner";


export default function RegisterLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <Banner />
        {children}
    </div>
  )
}