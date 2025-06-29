import React from "react";

const UserInfo: React.FC<{ user: any }> = ({ user }) => {
    if (!user) return null;
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
