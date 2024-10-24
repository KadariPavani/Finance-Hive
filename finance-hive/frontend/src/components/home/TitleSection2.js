import React from 'react';
import '../home/TitleSections.css'
const TitleSection2 = () => {
    return (
        <div className="title-section "style={{ backgroundColor: '#f5f2ff' }}>
            <div className="title-decoration">
                <span className="decoration-line"></span>
                <h2 className="section-title">The Financial Wizards</h2>
                <span className="decoration-line"></span>
            </div>
            <p className="section-subtitle">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
        </div>
    );
}

export default TitleSection2;
