import Form from '@/components/modules/Form';
import PageGuide from '@/components/modules/pageGuide';
import { requireRole } from '@/lib/requireRole';
import pageNameHandler from '@/utils/pageNameHandler';
import React, { memo, useEffect } from 'react'

function MangersPermissions({ user, pageName }) {
    useEffect(() => {
        pageNameHandler(pageName);
    }, []);
    return (
        <div dir="rtl"
            className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col">
            <PageGuide pageName="محدودیت مدیران" entityName="managerPermissions" />
            <Form
                user={user}
                entityName="managerPermissions"
                inputsContainerClassName="flex items-center gap-x-4"
                submitButtonText="اعمال محدودیت" />
        </div>
    )
}

export default memo(MangersPermissions)
export const getServerSideProps = requireRole("managerPermissions")();
