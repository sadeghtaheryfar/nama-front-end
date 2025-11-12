'use client';
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const  Forms = () => {
    const [data, setData] = useState();
    const router = useRouter();
    const [LoadingData, setLoadingData] = useState(false);

    const params = useSearchParams();

    const pathname = usePathname();
    const pathSegments = pathname.split("/");
    const itemId = pathSegments[1];

    useEffect(() => {
        setLoadingData(true);
        const fetching = async () => {
            try {
                const request = await axios.get(
                    `/api/forms/index?item_id=${itemId}&role=mosque_head_coach`,
                );

                if (request.data) {
                    const formsData = request?.data?.data;
                    setData(formsData);

                    const hasMandatoryForm = formsData.some((form) => form.required);
                    const hasReportForm = formsData.some((form) => form.report);
                    const skipForms = localStorage.getItem("skip");

                    const shouldRedirect =
                        hasMandatoryForm ||
                        hasReportForm ||
                        (!hasMandatoryForm && formsData.length > 0 && !skipForms);
                    
                    if (shouldRedirect && !pathname.startsWith(`/${itemId}/forms`)) {
                        router.push(`/${itemId}/forms`);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingData(false);
            }
        };
        fetching();
    }, []);

    return (
        <>
            
        </>
    );
};

export default Forms;