import { useEffect, useState } from "react";
import { getAuditLogs } from "../services/amlService";

export const useLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAuditLogs();
            setLogs(data);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    return logs;
};