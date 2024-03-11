import React from 'react';

const NotificationPermissionModal = ({ onClose }) => {
    const handleAllow = () => {
        onClose(true);
    };

    const handleDeny = () => {
        onClose(false);
    };

    return (
        <div className="notification-modal">
            <div className="notification-modal-content">
                <h2>Allow Notifications</h2>
                <p>Do you want to allow notifications?</p>
                <div className="button-container">
                    <button onClick={handleAllow}>Allow</button>
                    <button onClick={handleDeny}>Deny</button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPermissionModal;
