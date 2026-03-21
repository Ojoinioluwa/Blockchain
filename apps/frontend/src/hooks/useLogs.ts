import { useEffect, useState } from "react";
import { getLogs } from "../services/amlService";

export const useLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getLogs();
            setLogs(data);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    return logs;
};