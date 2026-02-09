import { requireRole } from '@/lib/requireRole';
import pageNameHandler from '@/utils/pageNameHandler';
import React, { memo, useEffect } from 'react'

function MangersPermissions({ user, pageName }) {
    useEffect(() => {
        pageNameHandler(pageName);
    }, []);
    return (
        <div>MangersPermissions</div>
    )
}

export default memo(MangersPermissions)
export const getServerSideProps = requireRole("manaegerPermissions")();
