import React from 'react';

function MenuItem({ title, icon }) {
    return (
        <div className="menu-item">
            <div className="icon">{icon}</div>
            <div className="title">{title}</div>
        </div>
    );
}

export default MenuItem;
