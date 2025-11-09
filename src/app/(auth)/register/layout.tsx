import Banner from "@/components/ui/Banner";


export default function RegisterLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
        <Banner />
        {children}
    </div>
  )
}