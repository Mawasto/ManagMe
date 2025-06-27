import React from "react";
import { UserManager } from "../api/UserManager";

const UserInfo: React.FC = () => {
    const user = UserManager.getLoggedInUser();

    return (
        <div>
            <h2>Logged-in User</h2>
            <p>
                {user.firstName} {user.lastName}
            </p>
        </div>
    );
};

export default UserInfo;
