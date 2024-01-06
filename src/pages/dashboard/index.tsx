import { useRouter } from "next/router"
import { useEffect } from "react"
import { withSession } from "~/server/auth/withSession"

export const getServerSideProps = withSession({force: true})

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/news")
  }, [router])

  return <></>
}
