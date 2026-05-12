import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";

const ProviderDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">Provider Dashboard</h1>
            <p>Welcome, {user?.firstName}!</p>
            <p>This is your service provider dashboard.</p>
        </div>
    );
};

export default ProviderDashboard;
