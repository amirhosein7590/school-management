import Form from '@/components/modules/Form';
import PageGuide from '@/components/modules/pageGuide';
import { requireRole } from '@/lib/requireRole';
import pageNameHandler from '@/utils/pageNameHandler';
import React, { useEffect } from 'react'

function SetSchool({ user, pageName }) {
    useEffect(() => {
        pageNameHandler(pageName);
    }, []);
    return (
        <div dir="rtl"
            className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col">
            <PageGuide entityName="setSchool" pageName="مدرسه بندی مدیران" />
            <Form user={user} entityName="setSchool" submitButtonText='ذخیره تغییرات' inputsContainerClassName="flex items-center gap-x-4" />
        </div>
    )
}

export default SetSchool
export const getServerSideProps = requireRole("setSchool")();
