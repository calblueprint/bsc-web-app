import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useUserRolePath = () => {
  const [isMemberPath, setIsMemberPath] = React.useState(false)
  const [isManagerPath, setIsManagerPath] = React.useState(false)
  const [isSupervisorPath, setIsSupervisorPath] = React.useState(false)

  const { pathname } = useRouter()
  useEffect(() => {
    setIsMemberPath(pathname.includes('/account/member'))
    setIsManagerPath(pathname.includes('/account/manager'))
    setIsSupervisorPath(pathname.includes('/account/supervisor'))
  }, [pathname])

  return { isMemberPath, isManagerPath, isSupervisorPath }
}
export default useUserRolePath
